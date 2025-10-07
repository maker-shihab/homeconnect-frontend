"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactCard({ propertyId }: { propertyId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(false);
    setSubmitting(true);
    try {
      const form = e.currentTarget;
      // TODO: replace with your API route
      await new Promise((r) => setTimeout(r, 800));
      setOk(true);
      form.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-xl border p-5">
      <h4 className="mb-3 text-lg font-semibold">Request information</h4>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="hidden" name="propertyId" value={propertyId} />
        <Input name="name" placeholder="Your name" required />
        <Input type="email" name="email" placeholder="Your email" required />
        <Input type="tel" name="phone" placeholder="Phone (optional)" />
        <Textarea name="message" placeholder="I’m interested in this property. Please contact me." rows={4} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Sending..." : "Request info"}
        </Button>
        {ok && <p className="text-sm text-emerald-600">Message sent! We’ll get back to you soon.</p>}
        <p className="text-xs text-muted-foreground">
          By sending, you agree to be contacted about this property.
        </p>
      </form>
    </Card>
  );
}