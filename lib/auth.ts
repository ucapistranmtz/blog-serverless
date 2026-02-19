import { betterAuth } from "better-auth";
export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.POSTGRES_URL!,
  },
  socialProviders: {
    cognito: {
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      region: process.env.AWS_REGION!,
      domain: process.env.COGNITO_DOMAIN!,
      // Esto asegura que Better Auth pida los perfiles necesarios
      scope: ["email", "openid", "profile"],
    },
  },
});
