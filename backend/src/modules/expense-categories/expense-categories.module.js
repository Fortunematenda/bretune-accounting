const { Module } = require('@nestjs/common');
const { ExpenseCategoriesController } = require('./expense-categories.controller');
const { ExpenseCategoriesService } = require('./expense-categories.service');

@Module({
  controllers: [ExpenseCategoriesController],
  providers: [ExpenseCategoriesService],
  exports: [ExpenseCategoriesService],
})
class ExpenseCategoriesModule {}

module.exports = { ExpenseCategoriesModule };
