import { envConfig } from "./env";

const isProduction = envConfig.NODE_ENV === "production";

let allowedOrigins: string[] = [];
if (isProduction) {
  allowedOrigins = envConfig.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());
} else {
  allowedOrigins = ["*"];
}
export const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
