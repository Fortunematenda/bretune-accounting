const { Module } = require('@nestjs/common');
const { SuppliersController } = require('./suppliers.controller');
const { SuppliersService } = require('./suppliers.service');

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
class SuppliersModule {}

module.exports = { SuppliersModule };
