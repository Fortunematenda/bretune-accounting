const { ForbiddenException, Inject, Injectable } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { ROLES_KEY } = require('../decorators/roles.decorator');

@Injectable()
class RolesGuard {
  constructor(@Inject(Reflector) reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

module.exports = { RolesGuard };
