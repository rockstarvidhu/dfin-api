import * as dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

export const APP = z
  .object({
    PORT: z.number(),
    NODE_ENV: z.string(),
    CORES_ENABLED: z.boolean(),
  })
  .parse({
    PORT: Number(process.env.APP_PORT),
    NODE_ENV: process.env.NODE_ENV,
    CORES_ENABLED:
      process.env.CORES_ENABLED?.toLowerCase() === "true" ? true : false,
  });

export const JWT = z
  .object({
    SECRET: z.string(),
  })
  .parse({
    SECRET: process.env.JWT_SECRET,
  });

export const DB = z
  .object({
    HOST_URL: z.string(),
    NAME: z.string(),
  })
  .parse({
    HOST_URL: process.env.DB_HOST_URL,
    NAME: process.env.DB_NAME,
  });

export const GOLD_API = z
  .object({
    GOLD_API_URL: z.string(),
    GOLD_API_TOKEN: z.string(),
  })
  .parse({
    GOLD_API_URL: process.env.GOLD_API_URL,
    GOLD_API_TOKEN: process.env.GOLD_API_TOKEN,
  });

export const SWAGGER_STATS = z
  .object({
    USERNAME: z.string(),
    PASSWORD: z.string(),
  })
  .parse({
    USERNAME: process.env.SWAGGER_STATS_USERNAME,
    PASSWORD: process.env.SWAGGER_STATS_PASSWORD,
  });
