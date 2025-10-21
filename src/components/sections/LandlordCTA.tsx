"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LandlordCTA() {
  return (
    <section aria-labelledby="landlord-cta-title" className="py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div
          className="
            relative overflow-hidden rounded-2xl border
            bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-600
            text-white shadow-lg ring-1 ring-white/10
          "
        >
          {/* Decorative glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"
          />

          <div className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
                For landlords
                <span className="h-1 w-1 rounded-full bg-white/70" />
                No long-term commitment
              </div>

              <h3
                id="landlord-cta-title"
                className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
              >
                List your property. Find qualified tenants faster.
              </h3>
              <p className="mt-2 max-w-prose text-white/90">
                Professional listings, verified applications, and streamlined
                lease and payment workflows — all in one place.
              </p>

              {/* Feature bullets */}
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Feature icon={ShieldCheck} label="Verified listing checks" />
                <Feature icon={FileText} label="Secure tenant applications" />
                <Feature icon={CreditCard} label="Payments and receipts" />
                <Feature icon={Headphones} label="Priority support" />
              </ul>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="
                    bg-white text-black hover:bg-white/90
                    transition-transform duration-200 hover:-translate-y-0.5
                  "
                >
                  <Link href="/list-property" aria-label="List your property on HomeConnect">
                    List your property
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/15 border-white/20"
                >
                  <Link href="/landlord" aria-label="Learn more about landlord services">
                    Learn more
                  </Link>
                </Button>
              </div>

              <p className="mt-3 text-xs text-white/80">
                Free preview. Cancel anytime. No hidden fees.
              </p>

              {/* Social proof */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4" aria-hidden="true" />
                  4.9/5 landlord rating
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  48h average review time
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  1k+ applications processed
                </span>
              </div>
            </div>

            {/* Right: Preview card */}
            <div className="relative">
              <div
                className="
                  group relative mx-auto max-w-md rounded-xl border border-white/20
                  bg-white/10 p-4 text-white shadow-2xl
                  supports-[backdrop-filter]:backdrop-blur-md
                "
                aria-label="Property listing preview"
              >
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Listing preview</div>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    Draft
                  </span>
                </div>

                {/* Media placeholder */}
                <div className="mt-3 overflow-hidden rounded-lg border border-white/20">
                  <div
                    className="
                      h-40 w-full bg-gradient-to-br from-white/30 to-white/10
                      animate-pulse
                    "
                    role="img"
                    aria-label="Property photo placeholder"
                  />
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Detail label="Price" value="$2,150/mo" />
                  <Detail label="Beds" value="2" />
                  <Detail label="Baths" value="2" />
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">123 Market St, SF</div>
                  <div className="text-xs text-white/80">
                    Available from Nov 1 • Pet friendly
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified checks
                  </span>
                  <Link
                    href="/list-property"
                    className="text-sm underline underline-offset-4 hover:text-white"
                  >
                    Continue setup
                  </Link>
                </div>

                {/* Hover lift */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 -z-10 rounded-xl
                    transition-transform duration-300 group-hover:-translate-y-1
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <li
      className="
        group flex items-center gap-3 rounded-xl border border-white/15
        bg-white/5 px-3 py-2
        transition-colors duration-200 hover:bg-white/10
      "
    >
      <span
        className="
          inline-flex h-9 w-9 items-center justify-center rounded-full
          bg-white/15 text-white ring-1 ring-white/20
          transition-transform duration-200 group-hover:scale-105
        "
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm">{label}</span>
    </li>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-2">
      <div className="text-[11px] uppercase tracking-wide text-white/70">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}