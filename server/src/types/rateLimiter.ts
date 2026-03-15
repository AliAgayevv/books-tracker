export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

export interface RequestCounter {
  count: number;
  resetTime: number;
}
