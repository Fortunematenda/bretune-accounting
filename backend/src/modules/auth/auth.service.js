const { BadRequestException, ConflictException, Inject, Injectable, Optional, UnauthorizedException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const bcrypt = require('bcryptjs');
const { PrismaService } = require('../../config/prisma.service');
const { EmailService } = require('../automation/email.service');
const { SubscriptionService } = require('../subscriptions/subscription.service');

@Injectable()
class AuthService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(JwtService) jwtService,
    @Optional() @Inject(EmailService) emailService = null,
    @Optional() @Inject(SubscriptionService) subscriptionService = null,
  ) {
    this.prisma = prismaService;
    this.jwt = jwtService;
    this.emailService = emailService;
    this.subscriptionService = subscriptionService;
    this.saltRounds = 12;
  }

  async validateUser(email, password) {
    const emailNormalized = String(email || '').trim().toLowerCase();
    if (!emailNormalized) throw new UnauthorizedException('Invalid credentials');

    const user = await this.prisma.user.findFirst({
      where: { email: { equals: emailNormalized, mode: 'insensitive' } },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Store refresh token hash in database (optional, for token revocation)
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.saltRounds);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        refreshToken: refreshTokenHash,
      },
    });

    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        company: true,
        roleRef: { include: { rolePermissions: { include: { permission: true } } } },
      },
    });

    let permissions = [];
    if (fullUser?.roleRef?.rolePermissions) {
      permissions = fullUser.roleRef.rolePermissions.map((rp) => rp.permission.key);
    } else if (user.role === 'ADMIN') {
      permissions = ['*'];
    }

    const company = fullUser?.company;
    const subscriptionStatus = company?.subscriptionStatus || null;
    const trialEndsAt = company?.trialEndsAt ? company.trialEndsAt.toISOString() : null;

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        userNumber: user.userNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName || null,
        companyId: user.companyId || null,
        role: user.role,
        roleId: fullUser?.roleId,
        roleRef: fullUser?.roleRef ? { id: fullUser.roleRef.id, name: fullUser.roleRef.name } : null,
        permissions,
        subscriptionStatus,
        trialEndsAt,
      },
    };
  }

  async refreshToken(refreshToken) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify refresh token matches stored hash
      const isValidRefreshToken = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async createAdmin(createAdminDto) {
    const { email, password, firstName, lastName, companyName } = createAdminDto;

    const emailNormalized = String(email || '').trim().toLowerCase();
    if (!emailNormalized) {
      throw new BadRequestException('Email is required');
    }

    // Check if user with this email already exists (case-insensitive)
    const existingUser = await this.prisma.user.findFirst({
      where: { email: { equals: emailNormalized, mode: 'insensitive' } },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists. Please use a different email or sign in.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const name = (companyName || 'Default Company').trim();
    let company = await this.prisma.company.findUnique({ where: { name } });

    if (!company) {
      company = await this.prisma.company.create({
        data: { name },
      });
      if (this.subscriptionService) {
        await this.subscriptionService.startTrial(company);
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
        firstName,
        lastName,
        companyName: name,
        companyId: company.id,
        role: 'ADMIN',
        isActive: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout(userId) {
    // Remove refresh token from database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, this.saltRounds);

    // Update password and remove refresh tokens
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        refreshToken: null,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId, dto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const data = {};
    if (dto.firstName != null) {
      const v = String(dto.firstName || '').trim();
      if (!v) throw new BadRequestException('firstName is required');
      data.firstName = v;
    }
    if (dto.lastName != null) {
      const v = String(dto.lastName || '').trim();
      if (!v) throw new BadRequestException('lastName is required');
      data.lastName = v;
    }
    if (dto.companyName !== undefined) {
      const v = String(dto.companyName || '').trim();
      data.companyName = v ? v : null;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        role: true,
      },
    });

    return {
      id: updated.id,
      userNumber: updated.userNumber,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      companyName: updated.companyName || null,
      role: updated.role,
    };
  }

  async forgotPassword(email) {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized) return { message: 'If an account exists for this email, you will receive reset instructions.' };
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' } },
    });

    if (!user || !user.isActive) {
      return { message: 'If an account exists for this email, you will receive reset instructions.' };
    }

    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      if (this.emailService) {
        await this.emailService.sendMail({
          to: user.email,
          subject: 'Reset your Bretune Accounting password',
          html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
          text: `Reset your password: ${resetLink}\n\nThis link expires in 1 hour.`,
        });
      }
    } catch (_) {
    }

    return { message: 'If an account exists for this email, you will receive reset instructions.' };
  }

  async resetPassword(token, newPassword) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!reset || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link. Please request a new one.');
    }

    if (!reset.user.isActive) {
      throw new BadRequestException('Account is inactive.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashedPassword, refreshToken: null },
      }),
      this.prisma.passwordReset.deleteMany({ where: { userId: reset.userId } }),
    ]);

    return { message: 'Password reset successfully. You can now sign in.' };
  }
}

module.exports = { AuthService };
