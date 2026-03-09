const { IsNumberString, IsOptional, IsString } = require('class-validator');

class InvoiceItemDto {
  @IsString()
  @IsOptional()
  productId;

  @IsString()
  description;

  @IsNumberString()
  quantity;

  @IsNumberString()
  unitPrice;

  @IsNumberString()
  @IsOptional()
  discount;

  @IsNumberString()
  @IsOptional()
  taxRate;
}

module.exports = { InvoiceItemDto };
