// app/terms/page.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pacifico } from "@/lib/fonts";
import { Mail, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HomeConnect",
  description:
    "Read the terms governing your use of HomeConnect for rentals, sales, and property management.",
};

const LAST_UPDATED = "2025-10-07";

export default function TermsPage() {
  return (
    <main className="pb-10">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-5xl px-4 pt-16 lg:pt-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className={`${pacifico.className} mb-4`}>HomeConnect</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
            <p className="mt-3 text-muted-foreground">Please review these terms before using HomeConnect.</p>
            <div className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 mt-10 lg:mt-14">
        <Card className="shadow-sm">
          <CardContent className="p-6 md:p-10 space-y-8">
            <div className="flex items-start gap-3 rounded-md border p-4 bg-muted/30">
              <Scale className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Academic template only — not legal advice. Replace with counsel-reviewed terms for production.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold">1. Acceptance of terms</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                By accessing or using HomeConnect, you agree to these Terms and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Changes to terms</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We may update these Terms. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Eligibility and accounts</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must be legally capable to enter contracts in your jurisdiction.</li>
                <li>Keep your account credentials confidential; you’re responsible for activity under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Listings and transactions</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We provide a platform connecting renters, buyers, sellers, and landlords.</li>
                <li>Availability, pricing, and terms for listings are subject to change and may be provided by third parties.</li>
                <li>We may verify certain details but cannot guarantee completeness or accuracy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Fees and payments</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Any fees will be disclosed prior to payment. You authorize us and our processors to charge your payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Acceptable use</h2>
              <Separator className="my-3" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>No unlawful, fraudulent, or abusive behavior.</li>
                <li>No scraping, reverse engineering, or interfering with the platform.</li>
                <li>No content that is illegal, infringing, or harmful.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. User content</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                You retain ownership of your content. You grant us a worldwide, non-exclusive license to host, display,
                and process it to operate the services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Intellectual property</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                The HomeConnect name, logos, and software are our property or licensed to us and protected by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Third‑party services</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We may link to third‑party sites or use third‑party providers. We are not responsible for their content or practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Disclaimers</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Services are provided “as is” without warranties. To the extent permitted by law, we disclaim implied warranties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Limitation of liability</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Indemnification</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                You agree to defend and hold harmless HomeConnect from claims arising from your use or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">13. Termination</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                We may suspend or terminate access for any violation. You may stop using the services at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">14. Governing law; disputes</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                Governed by the laws of your institutions jurisdiction. Disputes will be resolved in the competent courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">15. Contact</h2>
              <Separator className="my-3" />
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                legal@homeconnect.com
              </p>
            </section>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}