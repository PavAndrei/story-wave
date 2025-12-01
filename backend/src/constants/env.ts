import dotenv from 'dotenv';
dotenv.config();

// formating env-variables for typescript usage

const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv('NODE_ENV', 'development'); // development or production
export const PORT = getEnv('PORT', '4004'); // server port
export const MONGO_URI = getEnv('MONGO_URI'); // mongoDB connection uri
export const APP_ORIGIN = getEnv('APP_ORIGIN'); // frontend application

export const JWT_SECRET = getEnv('JWT_SECRET'); // token secret key
export const JWT_REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET'); // refresh token secret key

export const SMTP_USER = getEnv('SMTP_USER'); // SMTP user for nodemailer
export const SMTP_PASS = getEnv('SMTP_PASS'); // SMTP password for nodemailer
