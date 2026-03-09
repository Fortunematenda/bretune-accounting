const { IsArray, IsDateString, IsIn, IsNumberString, IsOptional, IsString, ValidateNested } = require('class-validator');
const { Type } = require('class-transformer');

class SupplierPaymentAllocationItemDto {
  @IsString()
  billId;

  @IsNumberString()
  amount;
}

class CreateSupplierPaymentDto {
  @IsString()
  supplierId;

  @IsNumberString()
  amount;

  @IsIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'VOIDED'])
  @IsOptional()
  status = 'COMPLETED';

  @IsIn(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE', 'CREDIT_NOTE'])
  method;

  @IsString()
  @IsOptional()
  reference;

  @IsString()
  @IsOptional()
  notes;

  @IsDateString()
  @IsOptional()
  paymentDate;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SupplierPaymentAllocationItemDto)
  allocations;
}

module.exports = { CreateSupplierPaymentDto, SupplierPaymentAllocationItemDto };
