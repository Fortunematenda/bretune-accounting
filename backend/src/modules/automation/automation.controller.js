const { Controller, Get, Inject, Query, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { PrismaService } = require('../../config/prisma.service');

@ApiTags('Automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('automation')
class AutomationController {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  @Get('email-outbox')
  async emailOutbox(@Query() query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const where = {};
    if (query.status) where.status = query.status;
    if (query.documentType) where.documentType = query.documentType;

    return this.prisma.paginate('emailOutbox', {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: { select: { id: true, invoiceNumber: true, status: true } },
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
      },
    });
  }

  @Get('recurring-runs')
  async recurringRuns(@Query() query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const where = {};
    if (query.recurringInvoiceId) where.recurringInvoiceId = query.recurringInvoiceId;

    return this.prisma.paginate('recurringInvoiceRun', {
      page,
      limit,
      where,
      orderBy: { runAt: 'desc' },
      include: {
        recurringInvoice: {
          select: { id: true, templateName: true, frequency: true, nextRunDate: true },
        },
      },
    });
  }
}

module.exports = { AutomationController };
