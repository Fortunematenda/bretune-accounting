const { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Inject, Patch, Post, Request, UseGuards } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } = require('@nestjs/swagger');
const { AuthService } = require('./auth.service');
const { CreateAdminDto, RefreshTokenDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } = require('./dto/login.dto');
const { JwtAuthGuard } = require('./guards/jwt-auth.guard');
const { LocalAuthGuard } = require('./guards/local-auth.guard');
const { validateDto } = require('../../common/utils/validate-dto');

@ApiTags('Authentication')
@Controller('auth')
class AuthController {
  constructor(@Inject(AuthService) authService) {
    this.authService = authService;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() body) {
    const dto = await validateDto(RefreshTokenDto, body);
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }

  @Post('create-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create admin user (first-time setup only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 403, description: 'Admin already exists' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createAdmin(@Body() body) {
    const dto = await validateDto(CreateAdminDto, body);
    return this.authService.createAdmin(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return {
      user: {
        id: req.user.id,
        userNumber: req.user.userNumber,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        companyName: req.user.companyName || null,
        role: req.user.role,
        roleId: req.user.roleId,
        roleRef: req.user.roleRef,
        permissions: req.user.permissions || [],
      },
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req, @Body() dto) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Invalid payload');
    }
    const user = await this.authService.updateProfile(req.user.id, dto);
    return { user };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Request() req,
    @Body() body,
  ) {
    const dto = await validateDto(ChangePasswordDto, body);
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'If account exists, reset email sent' })
  async forgotPassword(@Body() body) {
    const dto = await validateDto(ForgotPasswordDto, body);
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() body) {
    const dto = await validateDto(ResetPasswordDto, body);
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}

module.exports = { AuthController };
