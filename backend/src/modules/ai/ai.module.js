const { Module } = require('@nestjs/common');
const { AIService } = require('./ai.service');
const { AIController } = require('./ai.controller');

@Module({
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService],
})
class AIModule {}

module.exports = { AIModule };
