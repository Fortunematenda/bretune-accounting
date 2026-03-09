const { Module } = require('@nestjs/common');
const { UsersController } = require('./users.controller');
const { UsersService } = require('./users.service');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');

@Module({
  imports: [SubscriptionsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersModule {}

module.exports = { UsersModule };
