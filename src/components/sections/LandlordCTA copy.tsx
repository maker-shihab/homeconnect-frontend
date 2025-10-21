"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, FileText, Headphones, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandlordCTA() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to List Your Property?
          </h2>

          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of landlords who trust HomeConnect to find quality tenants quickly and securely.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Feature icon={ShieldCheck} label="Verified Tenants" />
            <Feature icon={FileText} label="Secure Process" />
            <Feature icon={CreditCard} label="Easy Payments" />
            <Feature icon={Headphones} label="24/7 Support" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Link href="/list-property">
                Start Listing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/landlord">
                Learn More
              </Link>
            </Button>
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
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="w-4 h-4 text-cyan-500" />
      <span>{label}</span>
    </div>
  );
}