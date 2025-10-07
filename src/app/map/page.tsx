import { listProperties } from "@/lib/properties";
import MapSearchClient from "./MapSearchClient";

export default function MapPage() {
  const items = listProperties().filter(p => p.lat && p.lng);
  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <MapSearchClient items={items as any} />
      </div>
    </main>
  );
}