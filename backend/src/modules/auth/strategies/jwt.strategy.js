const { ForbiddenException, Inject, Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const { PrismaService } = require('../../../config/prisma.service');

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(PrismaService) prismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });

    this.prisma = prismaService;
  }

  async validate(payload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        company: true,
        roleRef: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (user.companyId && user.company) {
      const status = user.company.subscriptionStatus;
      if (status === 'EXPIRED' || status === 'CANCELLED') {
        throw new ForbiddenException({
          message: status === 'EXPIRED' ? 'Your trial has expired' : 'Your subscription has been cancelled',
          requires_subscription: true,
        });
      }
    }

    let permissions = [];
    if (user.roleRef?.rolePermissions) {
      permissions = user.roleRef.rolePermissions.map((rp) => rp.permission.key);
    } else if (user.role === 'ADMIN') {
      permissions = ['*'];
    }

    return {
      id: user.id,
      userNumber: user.userNumber,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      companyId: user.companyId,
      role: user.role,
      roleId: user.roleId,
      roleRef: user.roleRef ? { id: user.roleRef.id, name: user.roleRef.name } : null,
      permissions,
      isActive: user.isActive,
    };
  }
}

module.exports = { JwtStrategy };
