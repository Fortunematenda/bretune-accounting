const { Type } = require('class-transformer');
const { IsArray, IsDateString, IsIn, IsNumberString, IsOptional, IsString, ValidateNested } = require('class-validator');
const { PaymentAllocationItemDto } = require('./payment-allocation-item.dto');

class CreatePaymentDto {
  @IsString()
  @IsOptional()
  invoiceId;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationItemDto)
  allocations;

  @IsString()
  clientId;

  @IsDateString()
  @IsOptional()
  paymentDate;

  @IsNumberString()
  amount;

  @IsIn(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE', 'CREDIT_NOTE'])
  method;

  @IsIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
  @IsOptional()
  status = 'COMPLETED';

  @IsString()
  @IsOptional()
  transactionId;

  @IsString()
  @IsOptional()
  notes;
}

module.exports = { CreatePaymentDto };
