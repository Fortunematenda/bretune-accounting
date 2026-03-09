const { IsDateString, IsIn, IsOptional, IsString } = require('class-validator');

class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name;

  @IsString()
  @IsOptional()
  description;

  @IsIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
  @IsOptional()
  status;

  @IsString()
  @IsOptional()
  clientId;

  @IsDateString()
  @IsOptional()
  startDate;

  @IsDateString()
  @IsOptional()
  endDate;
}

module.exports = { UpdateProjectDto };
