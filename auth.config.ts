import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
const dummyDb = {} as unknown as { _: { fullSchema?: unknown } };

export const auth = betterAuth({
  database: drizzleAdapter(dummyDb, { provider: "pg" }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        index: true,
      },
      outletId: {
        type: "string",
        required: false,
        index: true,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});

export default auth;
