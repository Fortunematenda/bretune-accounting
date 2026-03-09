const { Module } = require('@nestjs/common');
const { QuotesController } = require('./quotes.controller');
const { QuotesService } = require('./quotes.service');
const { SettingsModule } = require('../settings/settings.module');

@Module({
  imports: [SettingsModule],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
class QuotesModule {}

module.exports = { QuotesModule };
