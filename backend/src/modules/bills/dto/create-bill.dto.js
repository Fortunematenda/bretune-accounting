const { IsDateString, IsIn, IsNumberString, IsOptional, IsString } = require('class-validator');

class CreateBillDto {
  @IsString()
  vendorName;

  @IsNumberString()
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
  status = 'UNPAID';

  @IsString()
  @IsOptional()
  clientId;

  @IsString()
  @IsOptional()
  supplierId;
}

module.exports = { CreateBillDto };
