const { SetMetadata } = require('@nestjs/common');

const PERMISSION_KEY = 'permission';

const Permission = (permission) => SetMetadata(PERMISSION_KEY, permission);

module.exports = { Permission, PERMISSION_KEY };
