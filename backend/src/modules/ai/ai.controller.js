const { Controller, Get, Post, Put, Delete, Inject, Query, Param, Body, UseGuards, Req } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { AIService } = require('./ai.service');

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
class AIController {
  constructor(@Inject(AIService) aiService) {
    this.aiService = aiService;
  }

  // ── Suggestions ──────────────────────────────

  @Get('suggestions')
  async listSuggestions(@Req() req, @Query() query) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.getSuggestions(ownerCompanyName, {
      status: query.status || undefined,
      type: query.type || undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get('suggestions/stats')
  async suggestionStats(@Req() req) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.getSuggestionStats(ownerCompanyName);
  }

  @Put('suggestions/:id/accept')
  async acceptSuggestion(@Req() req, @Param('id') id) {
    return this.aiService.resolveSuggestion(id, {
      status: 'ACCEPTED',
      userId: req.user?.id || req.user?.userId,
    });
  }

  @Put('suggestions/:id/dismiss')
  async dismissSuggestion(@Req() req, @Param('id') id) {
    return this.aiService.resolveSuggestion(id, {
      status: 'DISMISSED',
      userId: req.user?.id || req.user?.userId,
    });
  }

  // ── Run AI Jobs ──────────────────────────────

  @Post('categorize')
  async runCategorize(@Req() req, @Query() query) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.categorizeTransactions(ownerCompanyName, {
      limit: query.limit ? Number(query.limit) : 50,
    });
  }

  @Post('match')
  async runMatch(@Req() req, @Query() query) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.matchTransactions(ownerCompanyName, {
      limit: query.limit ? Number(query.limit) : 50,
    });
  }

  @Post('detect-duplicates')
  async runDuplicateDetection(@Req() req, @Query() query) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.detectDuplicates(ownerCompanyName, {
      daysBack: query.daysBack ? Number(query.daysBack) : 90,
    });
  }

  // ── Automation Rules ─────────────────────────

  @Get('rules')
  async listRules(@Req() req, @Query() query) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.listRules(ownerCompanyName, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Post('rules')
  async createRule(@Req() req, @Body() body) {
    const ownerCompanyName = req.user?.companyName || null;
    return this.aiService.createRule({
      name: body.name,
      description: body.description || null,
      isActive: body.isActive !== false,
      priority: body.priority || 0,
      action: body.action,
      conditionsJson: body.conditions || [],
      actionParamsJson: body.actionParams || {},
      createdByUserId: req.user?.id || req.user?.userId,
      ownerCompanyName,
    });
  }

  @Put('rules/:id')
  async updateRule(@Param('id') id, @Body() body) {
    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.action !== undefined) data.action = body.action;
    if (body.conditions !== undefined) data.conditionsJson = body.conditions;
    if (body.actionParams !== undefined) data.actionParamsJson = body.actionParams;
    return this.aiService.updateRule(id, data);
  }

  @Delete('rules/:id')
  async deleteRule(@Param('id') id) {
    return this.aiService.deleteRule(id);
  }
}

module.exports = { AIController };
