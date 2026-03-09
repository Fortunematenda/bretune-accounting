const { PartialType } = require('@nestjs/swagger');
const { CreateQuoteDto } = require('./create-quote.dto');

class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}

module.exports = { UpdateQuoteDto };
