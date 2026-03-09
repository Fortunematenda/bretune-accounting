const { Type } = require('class-transformer');
const { IsArray, IsDateString, IsOptional, IsString } = require('class-validator');
const { QuoteItemDto } = require('./quote-item.dto');

class CreateQuoteDto {
  @IsString()
  clientId;

  @IsDateString()
  expiryDate;

  @IsString()
  @IsOptional()
  notes;

  @IsArray()
  @Type(() => QuoteItemDto)
  items;
}

module.exports = { CreateQuoteDto };
