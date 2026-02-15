import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL;

export const auth = betterAuth({
  database: new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Común para Neon en entornos de desarrollo
    },
  }),
  // Es crítico pasar esto para evitar el error 404 y el warning de Base URL
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
  },
});
