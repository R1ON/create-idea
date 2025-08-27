import { config } from 'dotenv';
import { z } from 'zod';


config();

const zNonEmptyTrim = z.string().trim().min(1);
const zNonEmptyTrimProdRequired = zNonEmptyTrim.optional().refine((value) => {
  return process.env.HOST_ENV === 'local' || !!value;
}, 'Обязательная ENV для PROD сборки');

const zEnv = z.object({
  PORT: zNonEmptyTrim,
  HOST_ENV: z.enum(['local', 'production']),
  JWT_SECRET: zNonEmptyTrim,
  PASSWORD_SALT: zNonEmptyTrim,
  DATABASE_URL: zNonEmptyTrim,
  INITIAL_ADMIN_PASSWORD: zNonEmptyTrim,
  WEBAPP_URL: zNonEmptyTrim,
  BREVO_API_KEY: zNonEmptyTrimProdRequired,
  FROM_EMAIL_NAME: zNonEmptyTrim,
  FROM_EMAIL_ADDRESS: zNonEmptyTrim,
});

export const env = zEnv.parse(process.env);
