const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(32).required(),
    otherwise: Joi.string().min(8).required(),
  }),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(32).required(),
    otherwise: Joi.string().min(8).required(),
  }),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Email (optional in dev)
  SMTP_HOST: Joi.string().allow(''),
  SMTP_PORT: Joi.number().port().allow(null),
  SMTP_USER: Joi.string().allow(''),
  SMTP_PASS: Joi.string().allow(''),
  FROM_EMAIL: Joi.string().allow(''),
  FROM_NAME: Joi.string().default('Bretune Accounting'),

  EMAIL_BATCH_SIZE: Joi.number().integer().min(1).default(20),
  EMAIL_MAX_ATTEMPTS: Joi.number().integer().min(1).default(10),

  // Rate limiting
  THROTTLE_TTL_SECONDS: Joi.number().integer().min(1).default(60),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),
}).unknown(true);

function validateEnv(config) {
  const { error, value } = envSchema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return value;
}

module.exports = { validateEnv };
