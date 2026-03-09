const {
  BadRequestException,
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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} = require('@nestjs/common');
const { FileInterceptor } = require('@nestjs/platform-express');
const { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ClientsService } = require('./clients.service');
const { CreateClientDto } = require('./dto/create-client.dto');
const { UpdateClientDto } = require('./dto/update-client.dto');

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
class CustomersController {
  constructor(@Inject(ClientsService) clientsService) {
    this.clientsService = clientsService;
  }

  @Post()
  async create(@Body() dto, @Request() req) {
    return this.clientsService.create(dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.clientsService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.clientsService.findOne(id, { currentUser: req?.user });
  }

  @Get(':id/documents')
  async listDocuments(@Param('id') id, @Request() req) {
    return this.clientsService.listDocuments(id, { currentUser: req?.user });
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        description: { type: 'string' },
      },
      required: ['file'],
    },
  })
  async uploadDocument(@Param('id') id, @UploadedFile() file, @Body() body, @Request() req) {
    if (!file || !file.buffer) throw new BadRequestException('File is required');
    if (file.size > 50 * 1024 * 1024) throw new BadRequestException('File size must be under 50MB');
    return this.clientsService.uploadDocument(id, file, { description: body?.description }, { currentUser: req?.user });
  }

  @Get(':id/documents/:documentId/download')
  async downloadDocument(@Param('id') id, @Param('documentId') documentId, @Request() req, @Res() res) {
    return this.clientsService.downloadDocument(id, documentId, res, { currentUser: req?.user });
  }

  @Delete(':id/documents/:documentId')
  async deleteDocument(@Param('id') id, @Param('documentId') documentId, @Request() req) {
    return this.clientsService.deleteDocument(id, documentId, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.clientsService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.clientsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { CustomersController };
