const { Inject, Injectable, Logger, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { EmailService } = require('../automation/email.service');

@Injectable()
class IspNotificationService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(EmailService) emailService = null,
  ) {
    this.prisma = prismaService;
    this.emailService = emailService;
    this.logger = new Logger(IspNotificationService.name);
  }

  // ── Settings helper ────────────────────────────────

  async getSettings(ownerCompanyName) {
    return this.prisma.ispBillingSettings.findFirst({
      where: { ownerCompanyName: ownerCompanyName || null },
    });
  }

  // ── Core send methods ──────────────────────────────

  async sendEmail(customer, { subject, html, text }) {
    const to = customer.billingEmail || customer.email;
    if (!to) {
      this.logger.warn(`No email for customer ${customer.id} (${customer.pppoeUsername})`);
      return null;
    }
    if (!this.emailService) {
      this.logger.warn('EmailService not available, skipping email send');
      return null;
    }
    try {
      await this.emailService.sendMail({ to, subject, html, text: text || html.replace(/<[^>]+>/g, '') });
      return { status: 'SENT', recipient: to };
    } catch (err) {
      this.logger.error(`Email send failed to ${to}: ${err.message}`);
      return { status: 'FAILED', recipient: to, error: err.message };
    }
  }

  async sendSms(customer, { message }, settings) {
    const phone = customer.phone;
    if (!phone || !settings?.smsApiKey) {
      return null;
    }

    const provider = (settings.smsApiProvider || '').toLowerCase();
    try {
      let result;
      if (provider === 'bulksms') {
        result = await this.sendBulkSms(phone, message, settings);
      } else if (provider === 'clickatell') {
        result = await this.sendClickatell(phone, message, settings);
      } else {
        this.logger.warn(`Unknown SMS provider: ${provider}`);
        return null;
      }
      return { status: 'SENT', recipient: phone, ...result };
    } catch (err) {
      this.logger.error(`SMS send failed to ${phone}: ${err.message}`);
      return { status: 'FAILED', recipient: phone, error: err.message };
    }
  }

  async sendWhatsapp(customer, { message }, settings) {
    const phone = customer.phone;
    if (!phone || !settings?.whatsappApiKey || !settings?.whatsappApiUrl) {
      return null;
    }

    try {
      const res = await fetch(settings.whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.whatsappApiKey}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      });
      if (!res.ok) throw new Error(`WhatsApp API ${res.status}: ${await res.text()}`);
      return { status: 'SENT', recipient: phone };
    } catch (err) {
      this.logger.error(`WhatsApp send failed to ${phone}: ${err.message}`);
      return { status: 'FAILED', recipient: phone, error: err.message };
    }
  }

  // ── SMS Provider Implementations ───────────────────

  async sendBulkSms(phone, message, settings) {
    const res = await fetch('https://api.bulksms.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${settings.smsApiKey}:${settings.smsApiSecret}`).toString('base64'),
      },
      body: JSON.stringify({
        from: settings.smsSenderId || undefined,
        to: phone.replace(/[^0-9+]/g, ''),
        body: message,
      }),
    });
    if (!res.ok) throw new Error(`BulkSMS ${res.status}: ${await res.text()}`);
    return {};
  }

  async sendClickatell(phone, message, settings) {
    const res = await fetch('https://platform.clickatell.com/messages/http/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': settings.smsApiKey,
      },
      body: JSON.stringify({
        content: message,
        to: [phone.replace(/[^0-9]/g, '')],
      }),
    });
    if (!res.ok) throw new Error(`Clickatell ${res.status}: ${await res.text()}`);
    return {};
  }

  // ── Log notification ───────────────────────────────

  async logNotification({ customerId, type, channel, recipient, subject, message, status, errorMessage, invoiceId, ownerCompanyName }) {
    return this.prisma.ispNotificationLog.create({
      data: { customerId, type, channel, recipient, subject, message, status, errorMessage, invoiceId, ownerCompanyName },
    });
  }

  // ── High-level notification dispatchers ────────────

  async notify(customer, type, { subject, html, text, smsMessage, invoiceId } = {}) {
    const settings = await this.getSettings(customer.ownerCompanyName);
    if (!settings) return [];

    const results = [];
    const plain = text || smsMessage || (html ? html.replace(/<[^>]+>/g, '') : '');

    // Email
    if (settings.enableEmailNotifications && this.shouldNotify(settings, type)) {
      const res = await this.sendEmail(customer, { subject, html, text: plain });
      if (res) {
        await this.logNotification({
          customerId: customer.id, type, channel: 'EMAIL',
          recipient: res.recipient, subject, message: plain,
          status: res.status, errorMessage: res.error || null,
          invoiceId, ownerCompanyName: customer.ownerCompanyName,
        });
        results.push(res);
      }
    }

    // SMS
    if (settings.enableSmsNotifications && this.shouldNotify(settings, type)) {
      const res = await this.sendSms(customer, { message: smsMessage || plain }, settings);
      if (res) {
        await this.logNotification({
          customerId: customer.id, type, channel: 'SMS',
          recipient: res.recipient, subject: null, message: smsMessage || plain,
          status: res.status, errorMessage: res.error || null,
          invoiceId, ownerCompanyName: customer.ownerCompanyName,
        });
        results.push(res);
      }
    }

    // WhatsApp
    if (settings.enableWhatsappNotifications && this.shouldNotify(settings, type)) {
      const res = await this.sendWhatsapp(customer, { message: smsMessage || plain }, settings);
      if (res) {
        await this.logNotification({
          customerId: customer.id, type, channel: 'WHATSAPP',
          recipient: res.recipient, subject: null, message: smsMessage || plain,
          status: res.status, errorMessage: res.error || null,
          invoiceId, ownerCompanyName: customer.ownerCompanyName,
        });
        results.push(res);
      }
    }

    return results;
  }

  shouldNotify(settings, type) {
    switch (type) {
      case 'INVOICE_CREATED': return settings.notifyOnInvoice;
      case 'PAYMENT_RECEIVED': return settings.notifyOnPayment;
      case 'OVERDUE_REMINDER': return settings.notifyOnOverdue;
      case 'SUSPENSION_WARNING': return settings.notifyOnSuspension;
      case 'SUSPENDED': return settings.notifyOnSuspension;
      case 'REACTIVATED': return settings.notifyOnPayment;
      default: return true;
    }
  }

  // ── Template-based notifications ───────────────────

  async notifyInvoiceCreated(customer, invoice, settings) {
    const companyName = settings?.companyName || 'Your ISP';
    const amount = Number(invoice.totalAmount || 0).toFixed(2);
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB') : 'N/A';

    const subject = `Invoice ${invoice.invoiceNumber} from ${companyName}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#6d28d9;">New Invoice</h2>
        <p>Dear ${customer.firstName},</p>
        <p>A new invoice has been generated for your account:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Invoice #</td><td style="padding:8px;border:1px solid #e2e8f0;">${invoice.invoiceNumber}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Amount</td><td style="padding:8px;border:1px solid #e2e8f0;">R ${amount}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Due Date</td><td style="padding:8px;border:1px solid #e2e8f0;">${dueDate}</td></tr>
        </table>
        ${settings?.bankName ? `<p><strong>Banking Details:</strong><br/>${settings.bankName}<br/>Acc: ${settings.bankAccountNumber || ''}<br/>Branch: ${settings.bankBranchCode || ''}</p>` : ''}
        <p>Please ensure payment is made by the due date to avoid service interruption.</p>
        <p>Regards,<br/>${companyName}</p>
      </div>`;
    const sms = `${companyName}: Invoice ${invoice.invoiceNumber} for R${amount} due ${dueDate}. Please pay to avoid service interruption.`;

    return this.notify(customer, 'INVOICE_CREATED', { subject, html, smsMessage: sms, invoiceId: invoice.id });
  }

  async notifyPaymentReceived(customer, payment, invoice) {
    const settings = await this.getSettings(customer.ownerCompanyName);
    const companyName = settings?.companyName || 'Your ISP';
    const amount = Number(payment.amount || 0).toFixed(2);

    const subject = `Payment Received - ${companyName}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#059669;">Payment Received</h2>
        <p>Dear ${customer.firstName},</p>
        <p>We have received your payment. Thank you!</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Payment #</td><td style="padding:8px;border:1px solid #e2e8f0;">${payment.paymentNumber}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Amount</td><td style="padding:8px;border:1px solid #e2e8f0;">R ${amount}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Invoice #</td><td style="padding:8px;border:1px solid #e2e8f0;">${invoice.invoiceNumber}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Method</td><td style="padding:8px;border:1px solid #e2e8f0;">${payment.method}</td></tr>
        </table>
        <p>Regards,<br/>${companyName}</p>
      </div>`;
    const sms = `${companyName}: Payment of R${amount} received for invoice ${invoice.invoiceNumber}. Thank you!`;

    return this.notify(customer, 'PAYMENT_RECEIVED', { subject, html, smsMessage: sms, invoiceId: invoice.id });
  }

  async notifyOverdueReminder(customer, invoice) {
    const settings = await this.getSettings(customer.ownerCompanyName);
    const companyName = settings?.companyName || 'Your ISP';
    const amount = Number(invoice.balanceDue || 0).toFixed(2);
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB') : 'N/A';

    const subject = `Overdue Notice - Invoice ${invoice.invoiceNumber}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#dc2626;">Overdue Invoice</h2>
        <p>Dear ${customer.firstName},</p>
        <p>Your invoice is overdue. Please settle the outstanding balance to avoid service suspension.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Invoice #</td><td style="padding:8px;border:1px solid #e2e8f0;">${invoice.invoiceNumber}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Outstanding</td><td style="padding:8px;border:1px solid #e2e8f0;">R ${amount}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Due Date</td><td style="padding:8px;border:1px solid #e2e8f0;">${dueDate}</td></tr>
        </table>
        ${settings?.bankName ? `<p><strong>Banking Details:</strong><br/>${settings.bankName}<br/>Acc: ${settings.bankAccountNumber || ''}<br/>Branch: ${settings.bankBranchCode || ''}</p>` : ''}
        <p>Regards,<br/>${companyName}</p>
      </div>`;
    const sms = `${companyName}: OVERDUE - Invoice ${invoice.invoiceNumber} R${amount} was due ${dueDate}. Pay now to avoid disconnection.`;

    return this.notify(customer, 'OVERDUE_REMINDER', { subject, html, smsMessage: sms, invoiceId: invoice.id });
  }

  async notifySuspended(customer) {
    const settings = await this.getSettings(customer.ownerCompanyName);
    const companyName = settings?.companyName || 'Your ISP';

    const subject = `Service Suspended - ${companyName}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#dc2626;">Service Suspended</h2>
        <p>Dear ${customer.firstName},</p>
        <p>Your internet service has been <strong>suspended</strong> due to unpaid invoices.</p>
        <p>To restore your service, please settle all outstanding invoices immediately.</p>
        ${settings?.bankName ? `<p><strong>Banking Details:</strong><br/>${settings.bankName}<br/>Acc: ${settings.bankAccountNumber || ''}<br/>Branch: ${settings.bankBranchCode || ''}</p>` : ''}
        ${settings?.companyPhone ? `<p>Contact us: ${settings.companyPhone}</p>` : ''}
        <p>Regards,<br/>${companyName}</p>
      </div>`;
    const sms = `${companyName}: Your internet service has been SUSPENDED due to unpaid invoices. Please pay immediately to restore service.`;

    return this.notify(customer, 'SUSPENDED', { subject, html, smsMessage: sms });
  }

  async notifyReactivated(customer) {
    const settings = await this.getSettings(customer.ownerCompanyName);
    const companyName = settings?.companyName || 'Your ISP';

    const subject = `Service Restored - ${companyName}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#059669;">Service Restored</h2>
        <p>Dear ${customer.firstName},</p>
        <p>Your internet service has been <strong>reactivated</strong>. Thank you for your payment!</p>
        <p>If you experience any connection issues, please contact us.</p>
        ${settings?.companyPhone ? `<p>Contact us: ${settings.companyPhone}</p>` : ''}
        <p>Regards,<br/>${companyName}</p>
      </div>`;
    const sms = `${companyName}: Your internet service has been RESTORED. Thank you for your payment!`;

    return this.notify(customer, 'REACTIVATED', { subject, html, smsMessage: sms });
  }

  // ── Notification log queries ───────────────────────

  async getNotificationLog(ownerCompanyName, { page = 1, limit = 50, type, channel, customerId } = {}) {
    const conditions = [];
    if (ownerCompanyName) {
      conditions.push({ OR: [{ ownerCompanyName }, { ownerCompanyName: null }] });
    }
    if (type) conditions.push({ type });
    if (channel) conditions.push({ channel });
    if (customerId) conditions.push({ customerId });

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [items, total] = await Promise.all([
      this.prisma.ispNotificationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { customer: { select: { id: true, firstName: true, lastName: true, pppoeUsername: true } } },
      }),
      this.prisma.ispNotificationLog.count({ where }),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async getNotificationStats(ownerCompanyName) {
    const conditions = [];
    if (ownerCompanyName) {
      conditions.push({ OR: [{ ownerCompanyName }, { ownerCompanyName: null }] });
    }
    const where = conditions.length > 0 ? { AND: conditions } : {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [total, sentToday, sentThisMonth, failed] = await Promise.all([
      this.prisma.ispNotificationLog.count({ where }),
      this.prisma.ispNotificationLog.count({ where: { ...where, createdAt: { gte: today }, status: 'SENT' } }),
      this.prisma.ispNotificationLog.count({ where: { ...where, createdAt: { gte: thisMonth }, status: 'SENT' } }),
      this.prisma.ispNotificationLog.count({ where: { ...where, status: 'FAILED' } }),
    ]);

    return { total, sentToday, sentThisMonth, failed };
  }
}

module.exports = { IspNotificationService };
