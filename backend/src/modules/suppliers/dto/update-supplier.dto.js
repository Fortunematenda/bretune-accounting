const { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateIf } = require('class-validator');

class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  supplierName;

  @IsString()
  @IsOptional()
  companyName;

  @IsString()
  @IsOptional()
  contactPerson;

  @ValidateIf((o) => o.email != null && String(o.email).trim() !== '')
  @IsEmail()
  @IsOptional()
  email;

  @IsString()
  @IsOptional()
  phone;

  @IsString()
  @IsOptional()
  address;

  @IsString()
  @IsOptional()
  taxNumber;

  @IsInt()
  @Min(0)
  @Max(365)
  @IsOptional()
  paymentTermsDays;

  @IsIn(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status;

  @IsString()
  @IsOptional()
  notes;
}

module.exports = { UpdateSupplierDto };
