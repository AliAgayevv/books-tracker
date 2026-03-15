import type { Request, Response, NextFunction } from "express";
import ResponseHandler from "../utils/responseHandler";
import { HttpStatus } from "@books-tracker/shared";
import { logger } from "../config/logger";
import { rateLimitConfigs } from "../config/rateLimiter";
import { RateLimitOptions, RequestCounter } from "../types/rateLimiter";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const CLEANUP_INTERVAL_MS = FIVE_MINUTES_MS;

export const rateLimitMiddleware = (
  options: Partial<RateLimitOptions> = rateLimitConfigs.global,
) => {
  const config: RateLimitOptions = {
    windowMs: options.windowMs ?? rateLimitConfigs.global.windowMs,
    max: options.max ?? rateLimitConfigs.global.max,
    message: options.message ?? rateLimitConfigs.global.message,
  };

  const store = new Map<string, RequestCounter>();

  const cleanupExpiredEntries = () => {
    const now = Date.now();
    for (const [ip, data] of store.entries()) {
      if (now - data.resetTime > config.windowMs) {
        store.delete(ip);
      }
    }
  };

  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const now = Date.now();

    let counter = store.get(ip);

    if (!counter) {
      counter = { count: 0, resetTime: now };
      store.set(ip, counter);
    }

    if (now - counter.resetTime > config.windowMs) {
      counter.count = 0;
      counter.resetTime = now;
    }

    counter.count++;

    const remainingRequests = Math.max(0, config.max - counter.count);
    const resetAt = new Date(counter.resetTime + config.windowMs).toUTCString();

    res.set({
      "X-RateLimit-Limit": String(config.max),
      "X-RateLimit-Remaining": String(remainingRequests),
      "X-RateLimit-Reset": resetAt,
    });

    if (counter.count > config.max) {
      const retryAfterSeconds = Math.ceil((counter.resetTime + config.windowMs - now) / 1000);

      res.set("Retry-After", String(retryAfterSeconds));

      logger.warn(
        { ip, count: counter.count, max: config.max, retryAfterSeconds },
        "Rate limit exceeded",
      );

      ResponseHandler.error(res, config.message, HttpStatus.TOO_MANY_REQUESTS);
      return;
    }

    next();
  };
};
