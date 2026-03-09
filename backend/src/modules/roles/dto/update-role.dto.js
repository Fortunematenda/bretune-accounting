const { IsArray, IsOptional, IsString, MaxLength } = require('class-validator');

class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color;

  @IsOptional()
  @IsArray()
  permissionIds;
}

module.exports = UpdateRoleDto;
