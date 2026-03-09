const { IsBoolean, IsDateString, IsIn, IsOptional, IsString } = require('class-validator');

class CreateTaskDto {
  @IsString()
  title;

  @IsString()
  @IsOptional()
  description;

  @IsIn(['GENERAL', 'FINANCE', 'CLIENT', 'PROJECT', 'SUPPORT'])
  @IsOptional()
  type = 'GENERAL';

  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  @IsOptional()
  priority = 'MEDIUM';

  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status = 'PENDING';

  @IsDateString()
  @IsOptional()
  dueDate;

  @IsBoolean()
  @IsOptional()
  reminderEnabled = false;

  @IsDateString()
  @IsOptional()
  reminderAt;

  @IsString()
  @IsOptional()
  assignedUserId;

  @IsString()
  @IsOptional()
  assignedEmployeeId;

  @IsString()
  @IsOptional()
  clientId;

  @IsString()
  @IsOptional()
  address;

  @IsString()
  @IsOptional()
  invoiceId;

  @IsString()
  @IsOptional()
  billId;

  @IsString()
  @IsOptional()
  projectId;

  @IsBoolean()
  @IsOptional()
  isTemplate = false;

  // recurrence is handled manually in service (JS reflection metadata does not enforce nested validation)
  @IsOptional()
  recurrence;
}

module.exports = { CreateTaskDto };
