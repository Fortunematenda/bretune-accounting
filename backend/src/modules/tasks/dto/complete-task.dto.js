const { IsOptional, IsString } = require('class-validator');

class CompleteTaskDto {
  @IsString()
  @IsOptional()
  comment;
}

module.exports = { CompleteTaskDto };
