import { Card } from "@/components/ui/card";
import { Bed, Briefcase, Building2, Home, Map } from "lucide-react";
import Link from "next/link";

const types = [
  { label: "Apartments", slug: "apartment", Icon: Building2 },
  { label: "Houses", slug: "house", Icon: Home },
  { label: "Studios", slug: "studio", Icon: Bed },
  { label: "Commercial", slug: "commercial", Icon: Briefcase },
  { label: "Land", slug: "land", Icon: Map },
];

export default function PropertyTypeGrid() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h3 className="mb-6 text-2xl font-bold">Explore by property type</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {types.map(({ label, slug, Icon }) => (
            <Link key={slug} href={`/search?type=${slug}`} className="group">
              <Card className="flex items-center gap-3 rounded-xl p-4 transition-colors group-hover:border-primary">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">View {label.toLowerCase()}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}