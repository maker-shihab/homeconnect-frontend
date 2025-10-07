import SearchClient from "@/components/search/SearchClient";
import { listProperties } from "@/lib/properties";

export default function SearchPage() {
  const items = listProperties();
  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <SearchClient items={items as any} />
      </div>
    </main>
  );
}