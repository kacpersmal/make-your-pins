import { Logger } from '@nestjs/common';
import * as Joi from 'joi';
import * as fs from 'fs';

export function validateEnv(config: Record<string, unknown>) {
  const logger = new Logger('EnvValidation');
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Define schema based on environment
  const schema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),

    // Add other environment variables here
    PORT: Joi.number().default(3000),

    // Firebase credentials
    GOOGLE_APPLICATION_CREDENTIALS: isDevelopment
      ? Joi.string().required()
      : Joi.string().optional(),

    ASSETS_BUCKET_NAME: Joi.string().required(),
  });

  // Validate
  const { error, value } = schema.validate(config, { allowUnknown: true });

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  // Additional validation for GOOGLE_APPLICATION_CREDENTIALS in development
  if (isDevelopment && value.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialsPath = value.GOOGLE_APPLICATION_CREDENTIALS as string;

    try {
      // Check if the file exists
      if (!fs.existsSync(credentialsPath)) {
        throw new Error(
          `GOOGLE_APPLICATION_CREDENTIALS file not found at: ${credentialsPath}`,
        );
      }

      // Check if it's a valid JSON file
      try {
        const content = fs.readFileSync(credentialsPath, 'utf8');
        JSON.parse(content);
        logger.log(
          `Firebase credentials file validated at: ${credentialsPath}`,
        );
      } catch (e) {
        throw new Error(
          `GOOGLE_APPLICATION_CREDENTIALS contains invalid JSON: ${e.message}`,
        );
      }
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  return value;
}
