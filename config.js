import dotenv from 'dotenv';

if (typeof process !== 'undefined' && process.cwd) {
  dotenv.config();
}

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';