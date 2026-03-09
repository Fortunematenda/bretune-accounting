const { Injectable } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

module.exports = { JwtAuthGuard };
