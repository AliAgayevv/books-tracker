import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino(
  { level: process.env.LOG_LEVEL ?? "info" },
  pino.transport({
    targets: [
      ...(isProduction
        ? [
            {
              target: "pino/file",
              options: { destination: "./logs/app.log", mkdir: true },
            },
          ]
        : [
            {
              target: "pino-pretty",
              options: { colorize: true },
            },
          ]),
    ],
  }),
);
