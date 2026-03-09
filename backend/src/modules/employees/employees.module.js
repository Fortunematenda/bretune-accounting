const { Module } = require('@nestjs/common');
const { EmployeesController } = require('./employees.controller');
const { EmployeesService } = require('./employees.service');

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
class EmployeesModule {}

module.exports = { EmployeesModule };
