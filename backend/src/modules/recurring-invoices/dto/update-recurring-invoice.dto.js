const { PartialType } = require('@nestjs/swagger');
const { CreateRecurringInvoiceDto } = require('./create-recurring-invoice.dto');

class UpdateRecurringInvoiceDto extends PartialType(CreateRecurringInvoiceDto) {}

module.exports = { UpdateRecurringInvoiceDto };
