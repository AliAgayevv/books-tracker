import { envConfig } from "../config/env";

export const validateEnv = (): boolean => {
  const fields = envConfig as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) {
      throw new Error(`Environment variable ${key} is not defined.`);
    }
  }
  return true;
};
