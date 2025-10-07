import { getPropertyById } from "@/lib/properties";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const p = getPropertyById(params.id);
  if (!p) return notFound();

  const currency = p.currency ?? "USD";
  const priceLabel = p.listingType === "rent" ? `${currency} ${p.price.toLocaleString()}/mo` : `${currency} ${p.price.toLocaleString()}`;

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/">Home</Link> <span>/</span>{" "}
          <Link href={`/search?lt=${p.listingType}`}>{p.listingType === "rent" ? "Rent" : "Buy"}</Link> <span>/</span>{" "}
          <span className="text-foreground">{p.neighborhood ?? p.city}</span>
        </nav>

        <h1 className="text-2xl font-bold md:text-3xl">{p.title}</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city}</span>
        </div>

        <div className="mt-4 relative overflow-hidden rounded-xl border">
          <div className="relative aspect-[16/9] w-full">
            <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="100vw" priority />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <section className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Bedrooms</div><div className="font-medium">{p.beds}</div></div></div>
              <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Bathrooms</div><div className="font-medium">{p.baths}</div></div></div>
              <div className="flex items-center gap-2"><Ruler className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Area</div><div className="font-medium">{p.areaSize.toLocaleString()} {p.areaUnit ?? "sqft"}</div></div></div>
              <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">City</div><div className="font-medium">{p.city}</div></div></div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{p.description ?? "No description available yet."}</p>
            </div>
          </section>

          <aside className="md:col-span-4 rounded-xl border p-5">
            <div className="text-2xl font-bold">{priceLabel}</div>
            <div className="text-sm text-muted-foreground">{p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city}</div>
            <div className="mt-4 grid gap-2">
              <Link href="/search" className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted">Back to search</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}