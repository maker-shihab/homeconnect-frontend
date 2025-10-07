import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandlordCTA() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-bold">Are you a landlord?</h3>
            <p className="mt-1 text-white/90">List your property and find qualified tenants faster.</p>
            <ul className="mt-4 space-y-2 text-white/90">
              <li>• Free listing preview</li>
              <li>• Secure tenant applications</li>
              <li>• Easy lease and payment tracking</li>
            </ul>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link href="/list-property">List your property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}