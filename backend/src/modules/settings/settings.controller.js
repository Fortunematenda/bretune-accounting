const { Body, Controller, Get, Inject, Patch, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { SettingsService } = require('./settings.service');

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
class SettingsController {
  constructor(@Inject(SettingsService) settingsService) {
    this.settingsService = settingsService;
  }

  @Get('company')
  getCompanySettings() {
    return this.settingsService.getCompanySettings();
  }

  @Patch('company')
  updateCompanySettings(@Body() dto) {
    return this.settingsService.updateCompanySettings(dto || {});
  }
}

module.exports = { SettingsController };
