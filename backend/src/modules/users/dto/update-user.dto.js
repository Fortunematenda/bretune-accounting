const { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } = require('class-validator');

class UpdateUserDto {
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
  companyName;

  @IsIn(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
  @IsOptional()
  role;

  @IsBoolean()
  @IsOptional()
  isActive;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password;
}

module.exports = { UpdateUserDto };
