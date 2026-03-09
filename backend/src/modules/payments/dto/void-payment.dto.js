const { IsOptional, IsString } = require('class-validator');

class VoidPaymentDto {
  @IsString()
  @IsOptional()
  reason;
}

module.exports = { VoidPaymentDto };
