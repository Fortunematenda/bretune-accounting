const { IsBoolean, IsEmail, IsOptional, IsString, ValidateIf } = require('class-validator');

class UpdateEmployeeDto {
  @ValidateIf((o) => o.email != null && String(o.email).trim() !== '')
  @IsEmail()
  @IsOptional()
  email;

  @IsString()
  @IsOptional()
  firstName;

  @IsString()
  @IsOptional()
  lastName;

  @IsString()
  @IsOptional()
  phone;

  @IsString()
  @IsOptional()
  title;

  @IsBoolean()
  @IsOptional()
  isActive;
}

module.exports = { UpdateEmployeeDto };
