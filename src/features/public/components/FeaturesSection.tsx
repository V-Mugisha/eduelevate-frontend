import { BookOpen, Laptop, Users } from "lucide-react";
import type { Feature } from "../types/types";

const features: Feature[] = [
  {
    title: "Self-Paced Learning",
    description:
      "Learn on your own schedule, at your own speed. Pause during school terms and resume during holidays without losing progress. Every course is always available when you are ready.",
    icon: "book-open",
  },
  {
    title: "Project-Based Curriculum",
    description:
      "Forget memorizing theory. Every course is built around a real project you complete from start to finish. Write code in your browser, run it instantly, and get automated feedback on your solutions.",
    icon: "laptop",
  },
  {
    title: "Industry Mentorship",
    description:
      "Connect with experienced software professionals who guide you through your learning journey. Get code reviews, ask questions, and receive career advice from people working in the field.",
    icon: "users",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  "book-open": <BookOpen className="text-primary size-6" />,
  laptop: <Laptop className="text-primary size-6" />,
  users: <Users className="text-primary size-6" />,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            From your first line of code to your first job-ready portfolio project, EduElevate
            provides the tools and guidance you need at every step.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
                {iconMap[feature.icon]}
              </div>
              <h3 className="text-foreground text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
