const {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ProjectsService } = require('./projects.service');
const { CreateProjectDto } = require('./dto/create-project.dto');
const { UpdateProjectDto } = require('./dto/update-project.dto');

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
class ProjectsController {
  constructor(@Inject(ProjectsService) projectsService) {
    this.projectsService = projectsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.projectsService.create(dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.projectsService.findAll(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.projectsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.projectsService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.projectsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { ProjectsController };
