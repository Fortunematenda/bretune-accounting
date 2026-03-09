const { ForbiddenException, Inject, Injectable } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { PERMISSION_KEY } = require('../decorators/permission.decorator');

@Injectable()
class PermissionGuard {
  constructor(@Inject(Reflector) reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    const requiredPermission = this.reflector.getAllAndOverride(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // Admin bypass: legacy role or Admin role
    if (user.role === 'ADMIN') return true;
    if (user.roleRef?.name === 'Admin') return true;
    if (user.permissions?.includes('*')) return true;

    const permissions = user.permissions || [];
    const hasPermission = permissions.includes(requiredPermission);
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}

module.exports = { PermissionGuard };
