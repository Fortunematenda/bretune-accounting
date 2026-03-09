const { Module } = require('@nestjs/common');
const { StatementsController } = require('./statements.controller');
const { StatementsService } = require('./statements.service');

@Module({
  controllers: [StatementsController],
  providers: [StatementsService],
  exports: [StatementsService],
})
class StatementsModule {}

module.exports = { StatementsModule };
