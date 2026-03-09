const { Type } = require('class-transformer');
const { IsArray, IsBoolean, IsDateString, IsOptional, IsString } = require('class-validator');
const { InvoiceItemDto } = require('./invoice-item.dto');

class CreateInvoiceDto {
  @IsString()
  clientId;

  @IsDateString()
  @IsOptional()
  issueDate;

  @IsDateString()
  @IsOptional()
  dueDate;

  @IsString()
  @IsOptional()
  notes;

  @IsArray()
  @Type(() => InvoiceItemDto)
  items;

  @IsBoolean()
  @IsOptional()
  send;
}

module.exports = { CreateInvoiceDto };
