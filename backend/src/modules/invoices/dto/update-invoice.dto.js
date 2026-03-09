const { PartialType } = require('@nestjs/swagger');
const { CreateInvoiceDto } = require('./create-invoice.dto');

class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

module.exports = { UpdateInvoiceDto };
