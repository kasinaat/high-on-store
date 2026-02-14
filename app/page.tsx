import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(245,158,11,0.18),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(20,184,166,0.18),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(59,130,246,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full border border-amber-300/30 bg-white/40 blur-2xl animate-floaty" />
      <div className="pointer-events-none absolute -right-32 top-52 h-72 w-72 rounded-full border border-teal-300/30 bg-white/40 blur-2xl animate-floaty" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-6 animate-fade-in">
          <span className="w-fit rounded-full border border-amber-400/40 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Storefront starter
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              High on Store: a bold stack for Neon, Better Auth, and oRPC.
            </h1>
            <p className="max-w-2xl text-lg text-zinc-700">
              Ship a shoppable experience fast with a typed API layer, Google
              auth, and a Postgres backbone that is ready for production.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/api/orpc/health">Check API health</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="#setup">View setup notes</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-amber-200/60 bg-white/80 shadow-sm backdrop-blur animate-rise-in">
            <CardHeader>
              <CardTitle>Better Auth + Google</CardTitle>
              <CardDescription>
                Social login with secure cookies and a Drizzle adapter.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              Ready for sessions, account linking, and future providers.
            </CardContent>
          </Card>
          <Card
            className="border-teal-200/60 bg-white/80 shadow-sm backdrop-blur animate-rise-in"
            style={{ animationDelay: "80ms" }}
          >
            <CardHeader>
              <CardTitle>oRPC API Layer</CardTitle>
              <CardDescription>
                Typed routes under /api/orpc with fetch handlers.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              Health and product endpoints ready to expand.
            </CardContent>
          </Card>
          <Card
            className="border-blue-200/60 bg-white/80 shadow-sm backdrop-blur animate-rise-in"
            style={{ animationDelay: "160ms" }}
          >
            <CardHeader>
              <CardTitle>Neon + Drizzle</CardTitle>
              <CardDescription>
                Postgres schema aligned with Better Auth and app data.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              Drizzle Kit config included for migrations.
            </CardContent>
          </Card>
        </section>

        <section id="setup" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-zinc-200/70 bg-white/85 shadow-sm backdrop-blur animate-rise-in">
            <CardHeader>
              <CardTitle>Quick start</CardTitle>
              <CardDescription>
                Fill in .env.local and run the Drizzle commands below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-950 px-5 py-4 font-mono text-sm text-zinc-100">
                <p>DATABASE_URL=postgresql://...</p>
                <p>BETTER_AUTH_SECRET=your-long-secret</p>
                <p>BETTER_AUTH_BASE_URL=http://localhost:3000</p>
                <p>GOOGLE_CLIENT_ID=</p>
                <p>GOOGLE_CLIENT_SECRET=</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-zinc-200/70 bg-white/85 shadow-sm backdrop-blur animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            <CardHeader>
              <CardTitle>Sample endpoints</CardTitle>
              <CardDescription>Hit these to verify the stack.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-700">
              <div className="rounded-lg border border-zinc-200/70 px-3 py-2">
                GET /api/orpc/outlets?pincode=560001
              </div>
              <div className="rounded-lg border border-zinc-200/70 px-3 py-2">
                GET /api/orpc/menu?outletId=outlet_id
              </div>
              <div className="rounded-lg border border-zinc-200/70 px-3 py-2">
                POST /api/orpc/admin/menu
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
