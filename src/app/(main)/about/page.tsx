// app/about/page.tsx
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Database,
  Filter,
  Github,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About | HomeConnect",
  description:
    "HomeConnect is a university final-year project: a real estate and rental system built with Next.js, TypeScript, Tailwind, and shadcn/ui.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Hero */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-500 text-white">Final Year Project</Badge>
          <Badge variant="outline">Real Estate + Rental System</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">About HomeConnect</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          HomeConnect is a university final-year project designed to connect renters and buyers with property owners.
          It showcases a modern property catalog, detailed listing pages with comments, a consistent data layer, and
          a map view — all built to demonstrate clean architecture, solid UX, and practical web engineering.
        </p>
      </div>

      {/* What is HomeConnect */}
      <Card className="mb-8 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">What is HomeConnect?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A full-stack demo platform where users can browse, filter, and view properties for rent or sale,
              explore them on a map, and discuss via comments. The project emphasizes consistent data sourcing,
              reusable UI components, and clear separation between the UI layer and the data layer.
            </p>
          </div>
        </div>
      </Card>

      {/* Key Features */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold">Key features</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <div className="font-medium">Browse & Filter</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Explore properties by listing type (Buy/Rent), price, beds, city, and more. Consistent cards for a clean overview.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <div className="font-medium">Property Details</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Rich details for each listing including price formatting, bed/bath/area, and neighborhood info.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div className="font-medium">Comments</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Built-in comment box with optimistic updates and API routes. Great for user feedback and Q&A.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="font-medium">Map View</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive map pins for all listings with quick popups and links to details.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <div className="font-medium">Featured & New</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dedicated sections that showcase featured properties and newly posted listings.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <div className="font-medium">Unified Data Layer</div>
            </div>
            <p className="text-sm text-muted-foreground">
              A single JSON dataset powers all pages (buy, rent, map, details) to prevent broken IDs or inconsistencies.
            </p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold">How it works</h3>
        <Card className="p-4">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Data is defined once in <code className="rounded bg-muted px-1 py-0.5">/data/properties.json</code> with standardized IDs
              like <code className="rounded bg-muted px-1 py-0.5">sale-1</code> and <code className="rounded bg-muted px-1 py-0.5">rent-1</code>.
            </li>
            <li>
              Helper functions in <code className="rounded bg-muted px-1 py-0.5">/lib/properties.ts</code> fetch and filter properties
              for Buy, Rent, Featured, New, and Map markers.
            </li>
            <li>
              UI components (cards, lists, map) read from the same helpers, ensuring a single source of truth.
            </li>
            <li>
              Comments are handled via Next.js API routes for a simple, decoupled backend.
            </li>
          </ol>
        </Card>
      </section>

      {/* Tech Stack */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold">Tech stack</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <div className="font-medium">Next.js (App Router) + TypeScript</div>
            </div>
            <p className="text-sm text-muted-foreground">Modern React architecture with server components and API routes.</p>
          </Card>

          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <Wrench className="h-4 w-4 rotate-90 text-primary" />
              <div className="font-medium">Tailwind CSS + shadcn/ui</div>
            </div>
            <p className="text-sm text-muted-foreground">Accessible, consistent components and utility-first styling.</p>
          </Card>

          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <div className="font-medium">JSON Dataset + API</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Centralized data with optional API filters to power client features and map view.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="font-medium">Leaflet (react-leaflet)</div>
            </div>
            <p className="text-sm text-muted-foreground">Lightweight interactive maps and markers for listings.</p>
          </Card>

          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div className="font-medium">Comments Module</div>
            </div>
            <p className="text-sm text-muted-foreground">Optimistic UI, form validation, and clean UX for feedback.</p>
          </Card>

          <Card className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <div className="font-medium">Ready to Extend</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Can be upgraded to Prisma + Postgres, auth, payments, and admin dashboards.
            </p>
          </Card>
        </div>
      </section>

      {/* Scope & Notes */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold">Scope and academic notes</h3>
        <Card className="p-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>This is an educational project demonstrating full-stack web concepts and UI/UX best practices.</li>
            <li>Data is demo-only. In production, migrate to a real database and add authentication/authorization.</li>
            <li>
              Payment flows, scheduling, and verification features are intentionally simplified or omitted for the project scope.
            </li>
          </ul>
        </Card>
      </section>

      {/* Contact & Credits */}
      <section className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold">Contact & credits</h3>
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 font-medium">Project Repository</div>
              <Link
                href="https://github.com/your-username/homeconnect"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-primary underline"
              >
                <Github className="h-4 w-4" />
                github.com/your-username/homeconnect
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                Replace with your actual repo link. Includes setup instructions and notes.
              </p>
            </div>
            <div>
              <div className="mb-1 font-medium">Get in touch</div>
              <Link href="mailto:youremail@example.com" className="inline-flex items-center gap-2 text-sm text-primary underline">
                <Mail className="h-4 w-4" />
                youremail@example.com
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                Questions, feedback, or collaboration ideas are welcome.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}