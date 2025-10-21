import SearchClient from "@/components/search/SearchClient";
import { listProperties } from "@/lib/properties";

export default async function SearchPage() {
  const items = await listProperties();

  return (
    <main className="pb-6 pt-28">
      <div className="container mx-auto px-4">
        <SearchClient items={items} />
      </div>
    </main>
  );
}