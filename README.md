# High on Store

Stacked Next.js storefront starter with:

- Drizzle ORM + Neon Postgres
- oRPC API layer
- Better Auth with Google OAuth
- Shadcn UI

## Quick start

1. Fill in `.env.local`.
2. Push the schema to your Neon database:

```bash
npm run db:push
```

3. Start the dev server:

```bash
npm run dev
```

## Useful endpoints

- GET `/api/orpc/health`
- GET `/api/orpc/products`
- POST `/api/auth/sign-in/social`

## Auth schema notes

If you change Better Auth configuration, re-generate the auth schema:

```bash
npx @better-auth/cli@latest generate --config auth.config.ts --output db/auth-schema.ts --yes
```
