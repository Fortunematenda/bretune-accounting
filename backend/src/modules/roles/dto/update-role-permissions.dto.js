const { IsArray } = require('class-validator');

class UpdateRolePermissionsDto {
  @IsArray()
  permissionIds;
}

module.exports = UpdateRolePermissionsDto;
