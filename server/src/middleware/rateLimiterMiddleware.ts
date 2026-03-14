import type { Request, Response, NextFunction } from "express";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

interface RequestCounter {
  count: number;
  resetTime: number;
}
