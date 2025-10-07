import { CalendarDays, FileSignature, Search } from "lucide-react";

const steps = [
  { title: "Search", desc: "Browse rentals and homes for sale.", Icon: Search },
  { title: "Visit", desc: "Schedule a tour or virtual viewing.", Icon: CalendarDays },
  { title: "Apply & Sign", desc: "Submit applications and sign securely.", Icon: FileSignature },
];

export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h3 className="mb-6 text-2xl font-bold">How it works</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {steps.map(({ title, desc, Icon }) => (
            <div key={title} className="rounded-xl border bg-background p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}