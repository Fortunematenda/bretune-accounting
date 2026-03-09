const { PartialType } = require('@nestjs/swagger');
const { CreateProductDto } = require('./create-product.dto');

class UpdateProductDto extends PartialType(CreateProductDto) {}

module.exports = { UpdateProductDto };
