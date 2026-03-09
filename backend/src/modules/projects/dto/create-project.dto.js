const { IsDateString, IsIn, IsOptional, IsString } = require('class-validator');

class CreateProjectDto {
  @IsString()
  name;

  @IsString()
  @IsOptional()
  description;

  @IsIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
  @IsOptional()
  status = 'ACTIVE';

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

module.exports = { CreateProjectDto };
