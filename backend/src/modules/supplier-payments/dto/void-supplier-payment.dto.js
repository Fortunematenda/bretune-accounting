const { IsOptional, IsString } = require('class-validator');

class VoidSupplierPaymentDto {
  @IsString()
  @IsOptional()
  reason;
}

module.exports = { VoidSupplierPaymentDto };
