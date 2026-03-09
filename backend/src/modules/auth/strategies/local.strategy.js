const { Inject, Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy } = require('passport-local');
const { AuthService } = require('../auth.service');

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) authService) {
    super({
      usernameField: 'email',
    });
    this.authService = authService;
  }

  async validate(email, password) {
    try {
      const user = await this.authService.validateUser(email, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

module.exports = { LocalStrategy };
