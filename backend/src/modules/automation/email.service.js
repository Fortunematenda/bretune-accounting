const { Injectable, Logger } = require('@nestjs/common');
const nodemailer = require('nodemailer');

@Injectable()
class EmailService {
  constructor() {
    this.logger = new Logger(EmailService.name);
    this.transporter = null;
  }

  getTransporter() {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error('SMTP configuration is missing (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    return this.transporter;
  }

  async sendMail({ to, subject, html, text }) {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.FROM_NAME || 'Bretune Accounting';

    const transporter = this.getTransporter();

    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
      text,
      attachments: Array.isArray(arguments[0]?.attachments) ? arguments[0].attachments : undefined,
    });

    this.logger.log(`Email sent to ${to} (${info.messageId || 'no-message-id'})`);
    return info;
  }
}

module.exports = { EmailService };
