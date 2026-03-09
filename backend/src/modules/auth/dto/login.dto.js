const { IsEmail, IsOptional, IsString, MinLength } = require('class-validator');

class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password;
}

class CreateAdminDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password;

  @IsString()
  firstName;

  @IsString()
  lastName;

  @IsOptional()
  @IsString()
  companyName;
}

class RefreshTokenDto {
  @IsString({ message: 'Refresh token is required' })
  refreshToken;
}

class ChangePasswordDto {
  @IsString()
  currentPassword;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword;
}

class ForgotPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email;
}

class ResetPasswordDto {
  @IsString({ message: 'Reset token is required' })
  token;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword;
}

module.exports = { LoginDto, CreateAdminDto, RefreshTokenDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto };
