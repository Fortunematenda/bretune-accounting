const { Module } = require('@nestjs/common');
const { FixedAssetsController } = require('./fixed-assets.controller');
const { FixedAssetsService } = require('./fixed-assets.service');
const { PrismaModule } = require('../../config/prisma.module');

@Module({
  imports: [PrismaModule],
  controllers: [FixedAssetsController],
  providers: [FixedAssetsService],
  exports: [FixedAssetsService],
})
class FixedAssetsModule {}

module.exports = { FixedAssetsModule };
