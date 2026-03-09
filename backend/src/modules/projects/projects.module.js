const { Module } = require('@nestjs/common');
const { ProjectsController } = require('./projects.controller');
const { ProjectsService } = require('./projects.service');

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
class ProjectsModule {}

module.exports = { ProjectsModule };
