import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  LOG_LEVEL: unknown;
  ALLOWED_ORIGINS: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  APP_NAME_FOR_2FA: string;
  CLIENT_URL: string;
}

export const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
  LOG_LEVEL: process.env.LOG_LEVEL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "books_tracker",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "password",
  SESSION_SECRET: process.env.SESSION_SECRET || "your-session-secret",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",
  APP_NAME_FOR_2FA: process.env.APP_NAME_FOR_2FA || "Books Tracker",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
