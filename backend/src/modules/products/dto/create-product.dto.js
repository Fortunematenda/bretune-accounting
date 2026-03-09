const {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsNumberString,
} = require('class-validator');

class CreateProductDto {
  @IsString()
  name;

  @IsIn(['PRODUCT', 'SERVICE'])
  @IsOptional()
  type = 'PRODUCT';

  @IsString()
  @IsOptional()
  description;

  @IsString()
  @IsOptional()
  sku;

  // Decimal money fields as string to avoid float issues
  @IsNumberString()
  price;

  @IsNumberString()
  @IsOptional()
  cost;

  // VAT percentage (e.g. 0.15 for 15%)
  @IsNumberString()
  @IsOptional()
  taxRate;

  @IsBoolean()
  @IsOptional()
  isRecurring = false;

  @IsIn(['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
  @IsOptional()
  recurringFrequency;

  @IsBoolean()
  @IsOptional()
  isActive = true;
}

module.exports = { CreateProductDto };
