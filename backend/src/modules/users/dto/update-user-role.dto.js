const { IsBoolean, IsIn, IsOptional, IsString } = require('class-validator');

class UpdateUserRoleDto {
  @IsOptional()
  @IsIn(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
  role;

  @IsOptional()
  @IsString()
  roleId;

  @IsOptional()
  @IsBoolean()
  isActive;
}

module.exports = UpdateUserRoleDto;
