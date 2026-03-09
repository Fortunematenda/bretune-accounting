const { IsBoolean, IsDateString, IsIn, IsOptional, IsString } = require('class-validator');

class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title;

  @IsString()
  @IsOptional()
  description;

  @IsIn(['GENERAL', 'FINANCE', 'CLIENT', 'PROJECT', 'SUPPORT'])
  @IsOptional()
  type;

  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  @IsOptional()
  priority;

  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status;

  @IsDateString()
  @IsOptional()
  dueDate;

  @IsBoolean()
  @IsOptional()
  reminderEnabled;

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
  isTemplate;

  @IsOptional()
  recurrence;
}

module.exports = { UpdateTaskDto };
