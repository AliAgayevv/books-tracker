import express from "express";
import helmet from "helmet";
import cors from "cors";

import { validateEnv } from "./utils/validateEnv";
import { logger } from "./config/logger";
import { envConfig } from "./config/env";
import { corsOptions } from "./config/corsOptions";
import { rateLimitMiddleware } from "./middleware/rateLimiterMiddleware";
import { rateLimitConfigs } from "./config/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { pool } from "./config/db";
import { sessionMiddleware } from "./config/session";
import { initializePassport } from "./config/passport";

import bookRouter from "./modules/books/book.router";
import authRouter from "./modules/auth/auth.router";

const globalRateLimit = rateLimitMiddleware(rateLimitConfigs.global);
const authRateLimit = rateLimitMiddleware(rateLimitConfigs.auth);
const isProduction = envConfig.NODE_ENV === "production";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.validateEnvironment();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private validateEnvironment(): void {
    try {
      validateEnv();
      console.info("Environment variables validated successfully");
    } catch (error) {
      logger.error({ error }, "Environment variable validation failed");
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    this.app.set("trust proxy", isProduction ? 2 : 1);

    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      }),
    );

    this.app.use(cors(corsOptions));
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    this.app.use(sessionMiddleware);

    const passportMiddleware = initializePassport();
    this.app.use(passportMiddleware.initialize);
    this.app.use(passportMiddleware.session);

    this.app.use(globalRateLimit);
  }

  private initializeRoutes(): void {
    this.app.get("/health", async (_req, res) => {
      try {
        await pool.query("SELECT 1");
        res.status(200).json({
          status: "OK",
          timestamp: new Date().toISOString(),
          database: "connected",
          uptime: process.uptime(),
          environment: envConfig.NODE_ENV,
        });
      } catch {
        res.status(503).json({
          status: "Error",
          timestamp: new Date().toISOString(),
          database: "disconnected",
        });
      }
    });

    // Auth routes
    this.app.use("/api/auth", authRateLimit, authRouter);

    // Protected routes
    this.app.use("/api/books", bookRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use((_req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    this.app.use(errorHandler);
  }

  private registerProcessEvents(server: ReturnType<express.Application["listen"]>): void {
    const gracefulShutdown = async (signal: string) => {
      console.info(`${signal} received, starting graceful shutdown...`);
      logger.info(`${signal} received, starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed");
        logger.info("HTTP server closed");

        try {
          await pool.end();
          logger.info("Database connection pool closed");
          console.info("Database connection pool closed");
        } catch (error) {
          console.log("Error closing database pool:", error);
          logger.error({ error }, "Error closing database pool");
        }

        logger.info("Graceful shutdown completed");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Graceful shutdown timed out, forcing exit");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      logger.error({ error: error.message, stack: error.stack }, "Uncaught exception");
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      logger.error({ reason }, "Unhandled rejection");
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      await pool.query("SELECT 1");
      logger.info("Database connection established");

      const server = this.app.listen(envConfig.PORT, "0.0.0.0", () => {
        logger.info({ port: envConfig.PORT, env: envConfig.NODE_ENV }, "Server started");

        if (!isProduction) {
          console.log("\n=== DEVELOPMENT ENDPOINTS ===");
          console.log(`🔗 Health:  http://localhost:${envConfig.PORT}/health`);
        }
      });

      this.registerProcessEvents(server);
    } catch (error) {
      logger.error({ error }, "Failed to start server");
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}

(async () => {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    logger.error({ error }, "Application failed to start");
    process.exit(1);
  }
})();

export default App;
