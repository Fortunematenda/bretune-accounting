const { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateIf } = require('class-validator');

class CreateClientDto {
  @IsIn(['INDIVIDUAL', 'COMPANY'])
  @IsOptional()
  type = 'COMPANY';

  @IsString()
  @IsOptional()
  companyName;

  @IsString()
  contactName;

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
  city;

  @IsString()
  @IsOptional()
  state;

  @IsString()
  @IsOptional()
  country;

  @IsString()
  @IsOptional()
  postalCode;

  @IsIn(['NONE', 'VAT_REGISTERED', 'VAT_EXEMPT'])
  @IsOptional()
  taxType = 'NONE';

  @IsString()
  @IsOptional()
  taxNumber;

  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  @IsOptional()
  status = 'ACTIVE';

  @IsInt()
  @Min(0)
  @Max(365)
  @IsOptional()
  paymentTermsDays = 30;

  @IsString()
  @IsOptional()
  notes;

  @IsOptional()
  openingBalance;

  @IsOptional()
  creditLimit;
}

module.exports = { CreateClientDto };
