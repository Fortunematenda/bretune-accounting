const { Controller, Get, Inject, Param, Query, Request, Res, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { StatementsService } = require('./statements.service');
const { generateStatementPdfBuffer } = require('../../common/utils/pdf-generator');

@ApiTags('Statements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statements')
class StatementsController {
  constructor(@Inject(StatementsService) statementsService) {
    this.statementsService = statementsService;
  }

  @Get('client/:clientId')
  async getClientStatement(@Param('clientId') clientId, @Query() query, @Request() req, @Res() res) {
    const statement = await this.statementsService.getClientStatement(clientId, { ...query, currentUser: req?.user });

    if (String(query.format || '').toLowerCase() !== 'pdf') {
      return statement;
    }

    const fileName = `bretune-accounting-statement-${clientId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    const pdf = await generateStatementPdfBuffer(statement);
    res.end(pdf);
  }
}

module.exports = { StatementsController };
