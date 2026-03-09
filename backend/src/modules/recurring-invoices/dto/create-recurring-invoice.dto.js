const { Type } = require('class-transformer');
const { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, Min } = require('class-validator');
const { RecurringInvoiceItemDto } = require('./recurring-invoice-item.dto');

class CreateRecurringInvoiceDto {
  @IsString()
  clientId;

  @IsString()
  templateName;

  @IsIn(['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
  frequency;

  @IsInt()
  @Min(1)
  @IsOptional()
  intervalValue = 1;

  @IsDateString()
  startDate;

  @IsDateString()
  @IsOptional()
  endDate;

  @IsDateString()
  nextRunDate;

  @IsBoolean()
  @IsOptional()
  isActive = true;

  @IsArray()
  @Type(() => RecurringInvoiceItemDto)
  items;

  @IsString()
  @IsOptional()
  notes;
}

module.exports = { CreateRecurringInvoiceDto };
