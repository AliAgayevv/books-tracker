import { RateLimitOptions } from "../types/rateLimiter";
const ONE_MINUTE_IN_SECONDS = 60 * 1000;
const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60 * 1000;

export const rateLimitConfigs = {
  global: {
    windowMs: FIFTEEN_MINUTES_IN_SECONDS,
    max: 100,
    message: "Too many requests, please try again later.",
  },
  auth: {
    windowMs: FIFTEEN_MINUTES_IN_SECONDS,
    max: 5,
    message: "Too many login attempts, please try again later.",
  },
  search: {
    windowMs: ONE_MINUTE_IN_SECONDS,
    max: 30,
    message: "Too many search requests, please slow down.",
  },
} satisfies Record<string, RateLimitOptions>;
