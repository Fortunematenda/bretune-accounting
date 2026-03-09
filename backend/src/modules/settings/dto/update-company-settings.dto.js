const { IsOptional, IsString } = require('class-validator');

class UpdateCompanySettingsDto {
  @IsOptional()
  @IsString()
  businessEmail;

  @IsOptional()
  @IsString()
  businessPhone;

  @IsOptional()
  @IsString()
  addressLine;

  @IsOptional()
  @IsString()
  city;

  @IsOptional()
  @IsString()
  country;

  @IsOptional()
  @IsString()
  tagline;

  @IsOptional()
  @IsString()
  bankName;

  @IsOptional()
  @IsString()
  accountName;

  @IsOptional()
  @IsString()
  accountNumber;

  @IsOptional()
  @IsString()
  branchCode;

  @IsOptional()
  @IsString()
  swiftCode;
}

module.exports = UpdateCompanySettingsDto;
