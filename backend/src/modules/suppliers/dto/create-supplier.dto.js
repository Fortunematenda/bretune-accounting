const { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateIf } = require('class-validator');

class CreateSupplierDto {
  @IsString()
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
  status = 'ACTIVE';

  @IsString()
  @IsOptional()
  notes;
}

module.exports = { CreateSupplierDto };
