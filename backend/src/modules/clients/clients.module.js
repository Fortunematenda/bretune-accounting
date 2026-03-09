const { Module } = require('@nestjs/common');
const { CustomersController } = require('./customers.controller');
const { ClientsService } = require('./clients.service');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');

@Module({
  imports: [SubscriptionsModule],
  controllers: [CustomersController],
  providers: [ClientsService],
  exports: [ClientsService],
})
class ClientsModule {}

module.exports = { ClientsModule };
