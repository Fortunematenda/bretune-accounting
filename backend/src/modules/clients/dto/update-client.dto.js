const { PartialType } = require('@nestjs/swagger');
const { CreateClientDto } = require('./create-client.dto');

class UpdateClientDto extends PartialType(CreateClientDto) {}

module.exports = { UpdateClientDto };
