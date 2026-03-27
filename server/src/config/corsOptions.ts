import { envConfig } from "./env";

const isProduction = envConfig.NODE_ENV === "production";

export const corsOptions = {
  origin: isProduction ? envConfig.ALLOWED_ORIGINS.split(",").map((o) => o.trim()) : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
