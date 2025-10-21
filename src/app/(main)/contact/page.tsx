// app/contact/page.tsx
import { ContactForm } from "@/components/contact/contact-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pacifico } from "@/lib/fonts";
import { Building2, Clock, Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | HomeConnect",
  description:
    "Get in touch with HomeConnect for rentals, sales, and property management. Fast response, expert support.",
};

type PageProps = {
  searchParams?: { propertyId?: string; type?: "rent" | "buy" | "sell" | "support" | "landlord" | "partnership" | "other" };
};

export default function ContactPage({ searchParams }: PageProps) {
  const prefillPropertyId = searchParams?.propertyId;
  const prefillType = searchParams?.type;

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-7xl px-4 pt-16 lg:pt-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className={`${pacifico.className} mb-4`}>HomeConnect</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Talk to our team. We’re here to help.
            </h1>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Whether you want to rent, buy, sell, or manage property, our specialists respond within one business day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> GDPR-ready
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> 4.9/5 client rating
              </span>
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Universities + Enterprise
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container mx-auto max-w-7xl px-4 mt-10 lg:mt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm prefill={{ propertyId: prefillPropertyId, type: prefillType }} />
              </CardContent>
            </Card>
          </div>

          {/* Right: Contact Info */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm sticky top-6">
              <CardHeader>
                <CardTitle>Contact information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <a href="tel:+11234567890" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Call us</div>
                      <div className="text-sm text-muted-foreground">+1 (123) 456-7890</div>
                    </div>
                  </a>
                  <a href="mailto:hello@homeconnect.com" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">hello@homeconnect.com</div>
                    </div>
                  </a>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Support hours</div>
                    <div className="text-sm text-muted-foreground">
                      Mon–Fri: 9:00–18:00 • Sat: 10:00–16:00
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">24/7 emergencies for tenants</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Offices</div>
                    <div className="text-sm text-muted-foreground">
                      200 Market St, Suite 6 • San Francisco, CA
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg overflow-hidden border">
                  <iframe
                    title="HomeConnect Office Map"
                    className="w-full h-56"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.089409571493!2d-122.4013635!3d37.7924015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ3JzMzLjYiTiAxMjLCsDI0JzAzLjEiVw!5e0!3m2!1sen!2sus!4v1685143162812"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}