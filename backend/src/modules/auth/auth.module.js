const { Module } = require('@nestjs/common');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { JwtModule } = require('@nestjs/jwt');
const { PassportModule } = require('@nestjs/passport');
const { AuthController } = require('./auth.controller');
const { AuthService } = require('./auth.service');
const { JwtStrategy } = require('./strategies/jwt.strategy');
const { LocalStrategy } = require('./strategies/local.strategy');
const { AutomationModule } = require('../automation/automation.module');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    AutomationModule,
    SubscriptionsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
class AuthModule {}

module.exports = { AuthModule };
