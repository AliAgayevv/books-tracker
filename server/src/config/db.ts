import { Pool } from "pg";
import { envConfig } from "./env";
import { logger } from "./logger";

export const pool = new Pool({
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  database: envConfig.DB_NAME,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,

  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on("error", (error) => {
  logger.error({ error }, "Unexpected database pool error");
});

pool.on("connect", () => {
  console.debug("New database connection established");
});
