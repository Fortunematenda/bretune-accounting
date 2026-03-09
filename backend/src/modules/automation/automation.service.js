const { Cron } = require('@nestjs/schedule');
const { Inject, Injectable, Logger } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { RecurringInvoicesService } = require('../recurring-invoices/recurring-invoices.service');
const { EmailService } = require('./email.service');
const { JobLockService } = require('./job-lock.service');
const { generateInvoicePdfBuffer, generateStatementPdfBuffer } = require('../../common/utils/pdf-generator');
const { StatementsService } = require('../statements/statements.service');
const { SettingsService } = require('../settings/settings.service');

function computeBackoffMinutes(attempt) {
  const steps = [1, 5, 30, 120, 720];
  return steps[Math.min(attempt, steps.length - 1)];
}

@Injectable()
class AutomationService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(RecurringInvoicesService) recurringInvoicesService,
    @Inject(StatementsService) statementsService,
    @Inject(EmailService) emailService,
    @Inject(JobLockService) jobLockService,
    @Inject(SettingsService) settingsService,
  ) {
    this.prisma = prismaService;
    this.recurringInvoicesService = recurringInvoicesService;
    this.statementsService = statementsService;
    this.emailService = emailService;
    this.jobLockService = jobLockService;
    this.settingsService = settingsService;
    this.logger = new Logger(AutomationService.name);
  }

  // Every 5 minutes
  @Cron('*/5 * * * *')
  async generateDueRecurringInvoices() {
    const lockName = 'recurring-invoices:generate-due';
    const gotLock = await this.jobLockService.acquireLock(lockName, {
      lockedBy: process.env.HOSTNAME || 'local',
      ttlMs: 10 * 60 * 1000,
    });

    if (!gotLock) return;

    try {
      const res = await this.recurringInvoicesService.runDue(null);
      this.logger.log(`Recurring generation: templates=${res.templatesProcessed}, invoices=${res.invoicesCreated}`);
    } catch (e) {
      this.logger.error(`Recurring generation failed: ${e.message}`);
    } finally {
      await this.jobLockService.releaseLock(lockName);
    }
  }

  // Every minute
  @Cron('*/1 * * * *')
  async sendQueuedEmails() {
    const lockName = 'email-outbox:send';
    const gotLock = await this.jobLockService.acquireLock(lockName, {
      lockedBy: process.env.HOSTNAME || 'local',
      ttlMs: 5 * 60 * 1000,
    });

    if (!gotLock) return;

    try {
      const maxBatch = process.env.EMAIL_BATCH_SIZE ? Number(process.env.EMAIL_BATCH_SIZE) : 20;
      const maxAttempts = process.env.EMAIL_MAX_ATTEMPTS ? Number(process.env.EMAIL_MAX_ATTEMPTS) : 10;

      const now = new Date();

      const outbox = await this.prisma.emailOutbox.findMany({
        where: {
          status: { in: ['PENDING', 'FAILED'] },
          nextAttemptAt: { lte: now },
          attempts: { lt: maxAttempts },
        },
        orderBy: { nextAttemptAt: 'asc' },
        take: maxBatch,
        include: {
          invoice: { include: { client: true, items: true } },
          client: true,
        },
      });

      for (const msg of outbox) {
        try {
          const attachments = [];

          if (msg.documentType === 'INVOICE') {
            if (msg.invoice) {
              const companySettings = await this.settingsService.getCompanySettings();
              const pdf = await generateInvoicePdfBuffer(msg.invoice, companySettings);
              attachments.push({
                filename: `bretune-accounting-invoice-${msg.invoice.invoiceNumber}.pdf`,
                content: pdf,
                contentType: 'application/pdf',
              });
            }
          }

          if (msg.documentType === 'STATEMENT') {
            if (!msg.clientId) {
              throw new Error('Statement email missing clientId');
            }

            const statement = await this.statementsService.getClientStatement(msg.clientId, {
              from: msg.statementFrom ? msg.statementFrom.toISOString() : undefined,
              to: msg.statementTo ? msg.statementTo.toISOString() : undefined,
            });

            const pdf = await generateStatementPdfBuffer(statement);
            attachments.push({
              filename: `bretune-accounting-statement-${msg.clientId}.pdf`,
              content: pdf,
              contentType: 'application/pdf',
            });
          }

          await this.emailService.sendMail({
            to: msg.to,
            subject: msg.subject,
            html: msg.body,
            text: msg.body.replace(/<[^>]+>/g, ''),
            attachments,
          });

          await this.prisma.$transaction(async (tx) => {
            await tx.emailOutbox.update({
              where: { id: msg.id },
              data: {
                status: 'SENT',
                sentAt: new Date(),
                lastError: null,
              },
            });

            // Mark invoice as SENT if it is still DRAFT
            if (msg.invoice && msg.invoice.status === 'DRAFT') {
              await tx.invoice.update({
                where: { id: msg.invoiceId },
                data: { status: 'SENT' },
              });
            }
          });
        } catch (e) {
          const nextAttempts = msg.attempts + 1;
          const backoffMin = computeBackoffMinutes(Math.min(nextAttempts, 10));
          const nextAttemptAt = new Date(Date.now() + backoffMin * 60 * 1000);

          await this.prisma.emailOutbox.update({
            where: { id: msg.id },
            data: {
              status: 'FAILED',
              attempts: { increment: 1 },
              lastError: e.message,
              nextAttemptAt,
            },
          });

          this.logger.warn(`Email send failed (${msg.to}): ${e.message}`);
        }
      }
    } catch (e) {
      this.logger.error(`Email outbox job failed: ${e.message}`);
    } finally {
      await this.jobLockService.releaseLock(lockName);
    }
  }
}

module.exports = { AutomationService };
