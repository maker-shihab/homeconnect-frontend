import Image from "next/image";
import Link from "next/link";

const cities = [
  { name: "City One", image: "/cities/1.jpg", q: "city-one" },
  { name: "City Two", image: "/cities/2.jpg", q: "city-two" },
  { name: "City Three", image: "/cities/1.jpg", q: "city-three" },
  { name: "City Four", image: "/cities/2.jpg", q: "city-four" },
];

export default function CityGrid() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h3 className="mb-6 text-2xl font-bold">Explore by city</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {cities.map((c) => (
            <Link key={c.q} href={`/search?city=${encodeURIComponent(c.q)}`} className="group relative block overflow-hidden rounded-xl">
              <div className="relative h-40 w-full">
                <Image src={c.image} alt={c.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
              </div>
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-white text-sm font-medium">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}