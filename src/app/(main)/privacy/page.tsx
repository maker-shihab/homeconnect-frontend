// app/privacy/page.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pacifico } from "@/lib/fonts";
import { Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | HomeConnect",
  description:
    "Learn how HomeConnect collects, uses, and protects your data for rentals, sales, and property management.",
};

const LAST_UPDATED = "2025-10-07";

export default function PrivacyPage() {
  return (
    <main className="pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-5xl px-4 pt-16 lg:pt-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className={`${pacifico.className} mb-4`}>HomeConnect</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-muted-foreground">
              We respect your privacy. This policy explains what we collect, why we collect it, and how we handle it.
            </p>
            <div className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto max-w-5xl px-4 mt-10 lg:mt-14">
        <Card className="shadow-sm">
          <CardContent className="p-6 md:p-10 space-y-8">
            <div className="flex items-start gap-3 rounded-md border p-4 bg-muted/30">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This page is an academic template and not legal advice. Replace with your own policy
                and have it reviewed by counsel before production use.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold">1. Information we collect</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Information you provide: name, email, phone, inquiry details, property preferences, messages.</li>
                <li>Automatic data: IP address, device/browser info, pages viewed, timestamps.</li>
                <li>Cookies and similar tech for session management, analytics, and performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. How we use information</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and improve our services, listings, and support.</li>
                <li>Respond to inquiries and schedule viewings.</li>
                <li>Detect abuse, prevent fraud, and ensure security.</li>
                <li>Analytics and product research (aggregate/anonymous when possible).</li>
                <li>Comply with legal obligations and enforce terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Legal bases (EEA/UK)</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Consent (e.g., marketing).</li>
                <li>Contract (e.g., responding to a service request).</li>
                <li>Legitimate interests (e.g., security, product improvement).</li>
                <li>Legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Retention</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We keep data only as long as necessary for the purposes above, then delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Sharing</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Vetted service providers (hosting, email, analytics) under contractual safeguards.</li>
                <li>Legal requests or to protect rights, property, and safety.</li>
                <li>Aggregate insights that do not identify individuals.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Your rights</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Depending on your region: access, correction, deletion, portability, restriction, objection, and
                withdrawing consent. To exercise rights, contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. International transfers</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Where data is transferred across borders, we rely on appropriate safeguards (e.g., SCCs) and vendor
                assessments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Security</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We use technical and organizational measures to protect data. No method is 100% secure; report issues to us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Children</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Our services are not directed at children under 13 (or as defined by local law). We do not knowingly collect their data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Changes</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We may update this policy. We’ll post the new date above and, when appropriate, notify you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Contact</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                privacy@homeconnect.com
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Add your postal address and DPO contact here for production.
              </p>
            </section>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}