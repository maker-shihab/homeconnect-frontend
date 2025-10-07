import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border bg-background p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Get new listings in your inbox</h3>
              <p className="text-muted-foreground">Weekly updates on rentals and properties for sale.</p>
            </div>
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              className="flex w-full max-w-md gap-2"
            >
              <label htmlFor="email" className="sr-only">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}