import { Mail, User, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useContactForm from "../hooks/useContactForm";

export default function ContactSection() {
  const { formValues, fieldErrors, handleChange, handleSubmit } = useContactForm();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  return (
    <section id="contact" className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Have a question or want to learn more? Send us a message and we will get back to you as
            soon as possible.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-12 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Full Name</Label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="contact-name"
                placeholder="Your name"
                className="pl-10"
                value={formValues.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", event.target.value)
                }
              />
            </div>
            {fieldErrors.name && <p className="text-destructive text-sm">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email Address</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formValues.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", event.target.value)
                }
              />
            </div>
            {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <div className="relative">
              <MessageSquare className="text-muted-foreground absolute top-3 left-3 size-4" />
              <Textarea
                id="contact-message"
                placeholder="Tell us what is on your mind..."
                className="min-h-35 pl-10"
                value={formValues.message}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange("message", event.target.value)
                }
              />
            </div>
            {fieldErrors.message && (
              <p className="text-destructive text-sm">{fieldErrors.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full sm:w-auto" size="lg">
            <Send className="mr-2 size-4" />
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
