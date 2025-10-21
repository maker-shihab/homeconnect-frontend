"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

const FormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional().refine((v) => !v || phoneRegex.test(v), {
    message: "Enter a valid phone number",
  }),
  type: z.enum(["rent", "buy", "sell", "landlord", "support", "partnership", "other"], {
    required_error: "Please select an inquiry type",
  }),
  propertyId: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (min 10 characters)"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept the privacy policy" }),
  }),
  // Honeypot anti-spam
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  prefill?: { propertyId?: string; type?: FormValues["type"] };
};

export function ContactForm({ prefill }: Props) {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      type: prefill?.type ?? "rent",
      propertyId: prefill?.propertyId ?? "",
      message: "",
      consent: false,
      company: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: FormValues) {
    // Basic spam guard
    if (values.company) return;

    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone || undefined,
          type: values.type,
          propertyId: values.propertyId || undefined,
          message: values.message,
          source: "homeconnect-web",
          pathname: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong");
      }

      form.reset({ ...form.getValues(), message: "", consent: false });
      toast.success("Message sent", {
        description: "Our team will get back to you within 1 business day.",
      });
    } catch (err: any) {
      toast.error("Could not send", {
        description: err?.message || "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...form.register("company")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" inputMode="email" placeholder="jane@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="+1 415 555 0199" {...field} />
                </FormControl>
                <FormDescription>We’ll call only if needed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inquiry type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="landlord">Landlord services</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property ID (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., HC-102" {...field} />
              </FormControl>
              <FormDescription>Include if your message is about a specific listing.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How can we help?</FormLabel>
              <FormControl>
                <Textarea placeholder="Share details about your inquiry..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  aria-label="Accept privacy policy"
                />
              </FormControl>
              <div className="text-sm text-muted-foreground">
                I agree to the HomeConnect{" "}
                <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                  Privacy Policy
                </a>
                .
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            Secure form. You’ll get a confirmation email.
          </div>
          <Button type="submit" className="min-w-[140px]" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}