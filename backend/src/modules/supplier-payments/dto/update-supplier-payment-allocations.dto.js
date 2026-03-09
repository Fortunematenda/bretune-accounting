const { IsArray, IsNumberString, IsOptional, IsString, ValidateNested } = require('class-validator');
const { Type } = require('class-transformer');

class SupplierPaymentAllocationPatchItemDto {
  @IsString()
  billId;

  @IsNumberString()
  amount;
}

class UpdateSupplierPaymentAllocationsDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SupplierPaymentAllocationPatchItemDto)
  allocations;
}

module.exports = { UpdateSupplierPaymentAllocationsDto, SupplierPaymentAllocationPatchItemDto };
