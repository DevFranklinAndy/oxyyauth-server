import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), "config.env") });

const envConfig = {
  PORT: process.env.PORT as string,
  DATABASE_URI: process.env.DATABASE_URI as string,
  NODE_ENV: process.env.NODE_ENV,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_EMAIL: process.env.RESEND_EMAIL,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET as string,
  CLIENT_URL: process.env.CLIENT_URL,
};

export default envConfig;
