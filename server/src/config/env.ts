interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  LOG_LEVEL?: unknown;
}

export const envCofnig: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
  LOG_LEVEL: process.env.LOG_LEVEL,
};
