const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { LedgerService } = require('../ledger/ledger.service');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function addQuarters(d, n) {
  return addMonths(d, n * 3);
}

function addYears(d, n) {
  const x = new Date(d);
  x.setFullYear(x.getFullYear() + n);
  return x;
}

@Injectable()
class RecurringJournalService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(LedgerService) ledgerService,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  computeNextRunDate(currentDate, frequency) {
    const d = new Date(currentDate);
    const f = String(frequency || '').toUpperCase();
    if (f === 'MONTHLY') return addMonths(d, 1);
    if (f === 'QUARTERLY') return addQuarters(d, 1);
    if (f === 'YEARLY') return addYears(d, 1);
    return addMonths(d, 1);
  }

  async create(userId, dto) {
    const name = cleanString(dto.name);
    if (!name) throw new BadRequestException('name is required');

    const lines = Array.isArray(dto.lines) ? dto.lines : [];
    if (lines.length < 2) throw new BadRequestException('At least 2 lines required');

    const frequency = dto.frequency || 'MONTHLY';
    if (!['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(frequency)) {
      throw new BadRequestException('frequency must be MONTHLY, QUARTERLY, or YEARLY');
    }

    const nextRunDate = dto.nextRunDate ? new Date(dto.nextRunDate) : new Date();

    return this.prisma.recurringJournalEntry.create({
      data: {
        name,
        memo: cleanString(dto.memo),
        frequency,
        nextRunDate,
        linesJson: lines,
        isActive: dto.isActive !== false,
        createdByUserId: userId,
      },
    });
  }

  async findAll({ page = 1, limit = 20, isActive } = {}) {
    const where = {};
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.paginate('recurringJournalEntry', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id) {
    const rec = await this.prisma.recurringJournalEntry.findUnique({ where: { id } });
    if (!rec) throw new NotFoundException('Recurring journal entry not found');
    return rec;
  }

  async update(id, dto) {
    await this.findOne(id);

    const data = {};
    if (dto.name !== undefined) data.name = cleanString(dto.name);
    if (dto.memo !== undefined) data.memo = cleanString(dto.memo);
    if (dto.frequency !== undefined) data.frequency = dto.frequency;
    if (dto.nextRunDate !== undefined) data.nextRunDate = new Date(dto.nextRunDate);
    if (dto.lines !== undefined) data.linesJson = dto.lines;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.recurringJournalEntry.update({
      where: { id },
      data,
    });
  }

  async processDueEntries() {
    const now = new Date();
    const due = await this.prisma.recurringJournalEntry.findMany({
      where: {
        isActive: true,
        nextRunDate: { lte: now },
      },
    });

    const results = [];
    for (const template of due) {
      try {
        const entry = await this.prisma.$transaction(async (tx) => {
          const lines = Array.isArray(template.linesJson) ? template.linesJson : [];
          const created = await this.ledgerService.postEntry(tx, {
            createdByUserId: template.createdByUserId,
            date: template.nextRunDate,
            memo: template.memo || template.name,
            sourceType: 'MANUAL',
            sourceId: null,
            lines,
          });

          const nextRun = this.computeNextRunDate(template.nextRunDate, template.frequency);
          await tx.recurringJournalEntry.update({
            where: { id: template.id },
            data: {
              nextRunDate: nextRun,
              lastRunAt: new Date(),
            },
          });

          return created;
        });

        results.push({
          templateId: template.id,
          templateName: template.name,
          entryId: entry.id,
          entryNumber: entry.entryNumber,
          status: 'success',
        });
      } catch (err) {
        results.push({
          templateId: template.id,
          templateName: template.name,
          status: 'error',
          error: err.message,
        });
      }
    }

    return { processed: results.length, results };
  }
}

module.exports = { RecurringJournalService };
