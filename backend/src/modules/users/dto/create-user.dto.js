const { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } = require('class-validator');

class CreateUserDto {
  @IsEmail()
  email;

  @IsString()
  @MinLength(8)
  password;

  @IsString()
  firstName;

  @IsString()
  lastName;

  @IsString()
  @IsOptional()
  companyName;

  @IsOptional()
  @IsIn(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
  role;

  @IsOptional()
  @IsString()
  roleId;

  @IsBoolean()
  @IsOptional()
  isActive;
}

module.exports = { CreateUserDto };
