const { Module } = require('@nestjs/common');
const { ProductsController } = require('./products.controller');
const { ProductsService } = require('./products.service');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');

@Module({
  imports: [SubscriptionsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
class ProductsModule {}

module.exports = { ProductsModule };
