const { IsDateString, IsIn, IsNumberString, IsOptional, IsString } = require('class-validator');

class UpdateBillDto {
  @IsString()
  @IsOptional()
  vendorName;

  @IsNumberString()
  @IsOptional()
  totalAmount;

  @IsString()
  @IsOptional()
  reference;

  @IsString()
  @IsOptional()
  description;

  @IsDateString()
  @IsOptional()
  billDate;

  @IsDateString()
  @IsOptional()
  dueDate;

  @IsIn(['DRAFT', 'OPEN', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'])
  @IsOptional()
  status;

  @IsString()
  @IsOptional()
  clientId;

  @IsString()
  @IsOptional()
  supplierId;
}

module.exports = { UpdateBillDto };
