const { Module } = require('@nestjs/common');
const { CurrenciesController } = require('./currencies.controller');
const { CurrenciesService } = require('./currencies.service');
const { PrismaModule } = require('../../config/prisma.module');

@Module({
  imports: [PrismaModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
class CurrenciesModule {}

module.exports = { CurrenciesModule };
