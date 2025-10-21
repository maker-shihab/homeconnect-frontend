// app/careers/page.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pacifico } from "@/lib/fonts";
import { Building2, HeartHandshake, Mail, Rocket } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | HomeConnect",
  description:
    "Explore careers at HomeConnect. Academic placeholder for now — join our talent network.",
};

export default function CareersPage() {
  const openRoles: Array<{
    title: string;
    type: string;
    location: string;
    link?: string;
  }> = []; // No live openings yet (academic placeholder)

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-6xl px-4 pt-16 lg:pt-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className={`${pacifico.className} mb-4`}>Academic • Talent network</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Build the future of real estate</h1>
            <p className="mt-3 text-muted-foreground">
              We’re not hiring just yet, but we’d love to meet builders, operators, and researchers who care about the
              renter and landlord experience.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto max-w-6xl px-4 mt-10 lg:mt-14 space-y-8">
        {/* Open Roles */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Open roles</CardTitle>
          </CardHeader>
          <CardContent>
            {openRoles.length === 0 ? (
              <div className="rounded-md border p-6 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  No openings right now. Join our talent network by emailing{" "}
                  <a className="underline underline-offset-4" href="mailto:careers@homeconnect.com">
                    careers@homeconnect.com
                  </a>{" "}
                  with your resume, GitHub, or portfolio. We’ll reach out when roles go live.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openRoles.map((role, idx) => (
                  <Card key={idx} className="border">
                    <CardHeader>
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <div>{role.type} • {role.location}</div>
                      {role.link && (
                        <a href={role.link} className="underline underline-offset-4">
                          Apply now
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Why HomeConnect */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Why HomeConnect</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Rocket className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Impactful product</div>
                <p className="text-sm text-muted-foreground">
                  Real problems in rentals, sales, and property ops — built with Next.js, TypeScript, and modern tooling.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Strong foundations</div>
                <p className="text-sm text-muted-foreground">
                  Clean architecture, accessibility, testing, and data privacy from day one.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HeartHandshake className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Learning culture</div>
                <p className="text-sm text-muted-foreground">
                  Mentorship, code reviews, and a bias for shipping. Great for final‑year projects evolving to production.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hiring process (placeholder) */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Our (future) hiring process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li>Intro screen: quick chat about goals and fit.</li>
              <li>Technical deep dive: portfolio or code sample review.</li>
              <li>Product exercise: small, time‑boxed challenge.</li>
              <li>Team chat and offer.</li>
            </ol>
            <Separator className="my-6" />
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              talent@homeconnect.com
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}