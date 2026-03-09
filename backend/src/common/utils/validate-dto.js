const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const { BadRequestException } = require('@nestjs/common');

/**
 * Validates body against a DTO class and throws BadRequestException on failure.
 * Use when ValidationPipe cannot infer the DTO type (e.g. in plain JS).
 */
async function validateDto(DtoClass, body) {
  const instance = plainToInstance(DtoClass, body || {}, {
    enableImplicitConversion: true,
  });
  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (errors.length > 0) {
    const messages = errors.flatMap((e) =>
      Object.values(e.constraints || {}),
    );
    throw new BadRequestException(messages.join('; ') || 'Validation failed');
  }
  return instance;
}

module.exports = { validateDto };
