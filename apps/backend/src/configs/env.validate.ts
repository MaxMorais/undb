import Joi from 'joi'
import path from 'node:path'

export const configSchema = Joi.object({
  // base
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(4000),
  // databse
  UNDB_DATABASE_SQLITE_DATA: Joi.string().default(path.resolve(process.cwd(), '../../.undb/data')),
  UNDB_SEED: Joi.string().equal('true').optional(),
  // storage object
  UNDB_OBJECT_STORAGE_PROVIDER: Joi.string().valid('local', 's3').default('local'),
  UNDB_OBJECT_STORAGE_LOCAL_PATH: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 'local',
    then: Joi.string().default(path.resolve(process.cwd(), './attachments')),
  }),
  // s3
  UNDB_S3_ENDPOINT: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),
  UNDB_S3_BUCKET: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string().default('undb'),
  }),
  UNDB_S3_ACCESS_KEY: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),
  UNDB_S3_SECRET_KEY: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),

  UNDB_JWT_SECRET: Joi.string().default('jwt_secret'),
  UNDB_ADMIN_EMAIL: Joi.string().email().optional(),
  UNDB_ADMIN_PASSWORD: Joi.string().optional(),
})
