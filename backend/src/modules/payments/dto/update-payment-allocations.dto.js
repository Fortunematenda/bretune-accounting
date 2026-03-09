const { Type } = require('class-transformer');
const { IsArray, ValidateNested } = require('class-validator');
const { PaymentAllocationItemDto } = require('./payment-allocation-item.dto');

class UpdatePaymentAllocationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationItemDto)
  allocations;
}

module.exports = { UpdatePaymentAllocationsDto };
