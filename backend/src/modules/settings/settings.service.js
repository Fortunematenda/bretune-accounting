const { Injectable, Inject } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

const DEFAULT_ID = 'default';

@Injectable()
class SettingsService {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  async getCompanySettings() {
    let row = await this.prisma.companySettings.findUnique({
      where: { id: DEFAULT_ID },
    });
    if (!row) {
      row = await this.prisma.companySettings.create({
        data: { id: DEFAULT_ID },
      });
    }
    return {
      businessEmail: row.businessEmail || '',
      businessPhone: row.businessPhone || '',
      addressLine: row.addressLine || '',
      city: row.city || '',
      country: row.country || '',
      tagline: row.tagline || '',
      bankName: row.bankName || '',
      accountName: row.accountName || '',
      accountNumber: row.accountNumber || '',
      branchCode: row.branchCode || '',
      accountType: row.accountType || '',
      displayCurrencyCode: row.displayCurrencyCode || null,
    };
  }

  async updateCompanySettings(dto) {
    const d = dto || {};
    const updateData = {};
    if (d.businessEmail !== undefined) updateData.businessEmail = String(d.businessEmail || '').trim() || null;
    if (d.businessPhone !== undefined) updateData.businessPhone = String(d.businessPhone || '').trim() || null;
    if (d.addressLine !== undefined) updateData.addressLine = String(d.addressLine || '').trim() || null;
    if (d.city !== undefined) updateData.city = String(d.city || '').trim() || null;
    if (d.country !== undefined) updateData.country = String(d.country || '').trim() || null;
    if (d.tagline !== undefined) updateData.tagline = String(d.tagline || '').trim() || null;
    if (d.bankName !== undefined) updateData.bankName = String(d.bankName || '').trim() || null;
    if (d.accountName !== undefined) updateData.accountName = String(d.accountName || '').trim() || null;
    if (d.accountNumber !== undefined) updateData.accountNumber = String(d.accountNumber || '').trim() || null;
    if (d.branchCode !== undefined) updateData.branchCode = String(d.branchCode || '').trim() || null;
    if (d.accountType !== undefined) updateData.accountType = String(d.accountType || '').trim() || null;
    if (d.displayCurrencyCode !== undefined) updateData.displayCurrencyCode = String(d.displayCurrencyCode || '').trim() || null;

    if (Object.keys(updateData).length > 0) {
      await this.prisma.companySettings.upsert({
        where: { id: DEFAULT_ID },
        create: { id: DEFAULT_ID, ...updateData },
        update: updateData,
      });
    }
    return this.getCompanySettings();
  }
}

module.exports = { SettingsService };
