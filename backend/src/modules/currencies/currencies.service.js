const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { Cron } = require('@nestjs/schedule');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');

const FRANKFURTER_BASE = 'https://api.frankfurter.dev/v1';

@Injectable()
class CurrenciesService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async getBaseCurrency() {
    const company = await this.prisma.company.findFirst();
    return company?.baseCurrencyCode || 'ZAR';
  }

  /**
   * Fetches latest exchange rates from Frankfurter API (ECB data, updates daily ~16:00 CET)
   * and stores them in the database. Syncs base currency → all other active currencies.
   */
  async syncRatesFromOnlineApi() {
    const base = await this.getBaseCurrency();
    const currencies = await this.prisma.currency.findMany({
      where: { isActive: true, code: { not: base } },
      select: { code: true },
    });
    const symbols = currencies.map((c) => c.code).join(',');
    if (!symbols) return { synced: 0, base, message: 'No other currencies to sync' };

    const url = `${FRANKFURTER_BASE}/latest?base=${base}&to=${symbols}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new BadRequestException(`Exchange rate API error: ${res.status} ${text}`);
    }
    const data = await res.json();
    const date = data.date ? new Date(data.date) : new Date();
    const rates = data.rates || {};
    let synced = 0;

    for (const [toCode, rate] of Object.entries(rates)) {
      if (!rate || !Number.isFinite(Number(rate))) continue;
      const amt = toDecimal(String(rate));
      if (amt.lte(0)) continue;
      try {
        await this.prisma.exchangeRate.upsert({
          where: {
            fromCurrencyCode_toCurrencyCode_asOfDate: {
              fromCurrencyCode: base,
              toCurrencyCode: toCode,
              asOfDate: date,
            },
          },
          create: {
            fromCurrencyCode: base,
            toCurrencyCode: toCode,
            rate: String(amt),
            asOfDate: date,
            source: 'API',
          },
          update: { rate: String(amt), source: 'API' },
        });
        synced += 1;
      } catch (err) {
        console.warn(`[Currencies] Failed to upsert rate ${base}→${toCode}:`, err.message);
      }
    }
    return { synced, base, date: date.toISOString().slice(0, 10) };
  }

  /** Sync every 30 minutes */
  @Cron('*/30 * * * *')
  async handleDailySync() {
    try {
      const result = await this.syncRatesFromOnlineApi();
      console.log(`[Currencies] Daily sync: ${result.synced} rates (base ${result.base})`);
    } catch (err) {
      console.warn('[Currencies] Daily sync failed:', err.message);
    }
  }

  async findAll() {
    return this.prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(code) {
    const c = await this.prisma.currency.findUnique({ where: { code } });
    if (!c) throw new NotFoundException('Currency not found');
    return c;
  }

  /**
   * Fetch historical exchange rates from Frankfurter for trend charts.
   */
  async getRateHistory({ fromCode, toCodes, fromDate, toDate } = {}) {
    const codes = Array.isArray(toCodes) ? toCodes : (toCodes ? [toCodes] : []);
    if (!fromCode || codes.length === 0) throw new BadRequestException('fromCode and toCodes required');
    const to = codes.join(',');
    const end = toDate ? new Date(toDate) : new Date();
    const start = fromDate ? new Date(fromDate) : new Date();
    start.setDate(start.getDate() - 90);
    const fromStr = start.toISOString().slice(0, 10);
    const toStr = end.toISOString().slice(0, 10);
    const url = `${FRANKFURTER_BASE}/${fromStr}..${toStr}?from=${fromCode}&to=${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new BadRequestException('Exchange rate API unavailable');
    const data = await res.json();
    const rates = data.rates || {};
    const arr = Object.entries(rates).map(([date, vals]) => ({
      date,
      ...vals,
    }));
    return arr.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Fetch live rate from Frankfurter API. Use for converter to guarantee correct rates.
   */
  async getLiveRate(fromCode, toCode) {
    if (fromCode === toCode) return toDecimal('1');
    const url = `${FRANKFURTER_BASE}/latest?base=${fromCode}&to=${toCode}`;
    const res = await fetch(url);
    if (!res.ok) throw new BadRequestException('Exchange rate API unavailable');
    const data = await res.json();
    const rates = data.rates || {};
    const rate = rates[toCode];
    if (rate == null || !Number.isFinite(Number(rate))) {
      throw new NotFoundException(`Rate not found for ${fromCode}→${toCode}`);
    }
    return toDecimal(String(rate));
  }

  async getExchangeRate(fromCode, toCode, asOfDate) {
    if (fromCode === toCode) return toDecimal('1');
    const d = asOfDate ? new Date(asOfDate) : new Date();

    // 1. Direct: from → to
    let rate = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: fromCode,
        toCurrencyCode: toCode,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });
    if (rate) return toDecimal(rate.rate);

    // 2. Inverse: to → from, return 1/rate (1 unit of "to" = rate units of "from", so 1 unit of "from" = 1/rate units of "to")
    const inverse = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: toCode,
        toCurrencyCode: fromCode,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });
    if (inverse) {
      const inv = toDecimal(inverse.rate);
      if (inv.gt(0)) return toDecimal('1').div(inv);
    }

    // 3. Cross-rate via base: from→base and base→to, or base→from and base→to
    const base = await this.getBaseCurrency();
    const baseToFrom = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: base,
        toCurrencyCode: fromCode,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });
    const fromToBase = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: fromCode,
        toCurrencyCode: base,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });
    const baseToTo = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: base,
        toCurrencyCode: toCode,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });
    const toToBase = await this.prisma.exchangeRate.findFirst({
      where: {
        fromCurrencyCode: toCode,
        toCurrencyCode: base,
        asOfDate: { lte: d },
      },
      orderBy: { asOfDate: 'desc' },
    });

    // rate(from→to) = rate(base→to) / rate(base→from), i.e. (1 from = 1/baseToFrom base) * (1 base = baseToTo to)
    if (baseToFrom && baseToTo) {
      const b2f = toDecimal(baseToFrom.rate);
      const b2t = toDecimal(baseToTo.rate);
      if (b2f.gt(0)) return b2t.div(b2f);
    }
    // rate(from→to) = 1 / rate(to→base) * rate(from→base)
    if (fromToBase && toToBase) {
      const f2b = toDecimal(fromToBase.rate);
      const t2b = toDecimal(toToBase.rate);
      if (t2b.gt(0)) return f2b.div(t2b);
    }
    // rate(from→to) = rate(from→base) * rate(base→to)
    if (fromToBase && baseToTo) {
      const f2b = toDecimal(fromToBase.rate);
      const b2t = toDecimal(baseToTo.rate);
      return f2b.mul(b2t);
    }
    // rate(from→to) = 1/rate(to→base) / rate(base→from)
    if (toToBase && baseToFrom) {
      const t2b = toDecimal(toToBase.rate);
      const b2f = toDecimal(baseToFrom.rate);
      if (t2b.gt(0) && b2f.gt(0)) return toDecimal('1').div(t2b).div(b2f);
    }

    throw new NotFoundException(`No exchange rate found for ${fromCode}→${toCode}`);
  }

  async setExchangeRate(userId, { fromCode, toCode, rate, asOfDate, source = 'MANUAL' }) {
    const from = await this.findOne(fromCode);
    const to = await this.findOne(toCode);
    const amt = toDecimal(rate || '0');
    if (amt.lte(0)) throw new BadRequestException('Rate must be positive');
    const d = asOfDate ? new Date(asOfDate) : new Date();

    return this.prisma.exchangeRate.upsert({
      where: {
        fromCurrencyCode_toCurrencyCode_asOfDate: {
          fromCurrencyCode: fromCode,
          toCurrencyCode: toCode,
          asOfDate: d,
        },
      },
      create: {
        fromCurrencyCode: fromCode,
        toCurrencyCode: toCode,
        rate: String(amt),
        asOfDate: d,
        source,
      },
      update: { rate: String(amt), source },
    });
  }

  async listRates({ fromCode, toCode, fromDate, toDate } = {}) {
    const where = {};
    if (fromCode) where.fromCurrencyCode = fromCode;
    if (toCode) where.toCurrencyCode = toCode;
    if (fromDate) where.asOfDate = { ...where.asOfDate, gte: new Date(fromDate) };
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      where.asOfDate = { ...where.asOfDate, lte: d };
    }

    return this.prisma.exchangeRate.findMany({
      where,
      orderBy: [{ fromCurrencyCode: 'asc' }, { toCurrencyCode: 'asc' }, { asOfDate: 'desc' }],
    });
  }
}

module.exports = { CurrenciesService };
