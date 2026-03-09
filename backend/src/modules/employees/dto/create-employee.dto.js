const { IsBoolean, IsEmail, IsOptional, IsString, ValidateIf } = require('class-validator');

class CreateEmployeeDto {
  @ValidateIf((o) => o.email != null && String(o.email).trim() !== '')
  @IsEmail()
  @IsOptional()
  email;

  @IsString()
  firstName;

  @IsString()
  lastName;

  @IsString()
  @IsOptional()
  phone;

  @IsString()
  @IsOptional()
  title;

  @IsBoolean()
  @IsOptional()
  isActive = true;
}

module.exports = { CreateEmployeeDto };
