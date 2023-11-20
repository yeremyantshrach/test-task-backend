import * as Joi from 'joi';

export const config = () => ({
  env: process.env.ENV_NAME,
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  flags: {
    prodSwaggerEnabled: process.env.FLAGS_PROD_SWAGGER_ON === 'true',
  },
});

export type IAppConfig = ReturnType<typeof config>;

export const validationSchema = Joi.object({
  ENV_NAME: Joi.string().valid('local', 'dev', 'nonprod', 'prod').required(),
  PORT: Joi.number().default(8080),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  FLAGS_PROD_SWAGGER_ON: Joi.boolean().default(false),
});

export const validationOptions = {
  stripUnknown: true,
  abortEarly: true,
};
