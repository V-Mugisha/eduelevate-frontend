import type { HowItWorksStep } from "../types/types";

const steps: HowItWorksStep[] = [
  {
    stepNumber: 1,
    title: "Create Your Account",
    description:
      "Sign up for a free student account in under a minute. No programming experience required, just your name, email, and a password to get started.",
  },
  {
    stepNumber: 2,
    title: "Choose a Course",
    description:
      "Browse the course catalog and pick a track that interests you. Courses are organized by skill level, so you can start from the very basics or jump into more advanced topics.",
  },
  {
    stepNumber: 3,
    title: "Learn by Building",
    description:
      "Follow step-by-step lessons and write real code directly in your browser. Our built-in code editor lets you see your work come to life instantly without installing anything.",
  },
  {
    stepNumber: 4,
    title: "Get Instant Feedback",
    description:
      "Submit your code and receive immediate automated feedback. Tests check if your solution is correct and show you exactly what to fix so you can learn from every attempt.",
  },
  {
    stepNumber: 5,
    title: "Build Your Portfolio",
    description:
      "Complete courses and earn certificates. Collect your finished projects into a professional portfolio that you can share with universities and potential employers.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            How EduElevate works
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Five simple steps to go from complete beginner to job-ready developer.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.stepNumber} className="relative text-center">
              <div className="bg-primary text-primary-foreground mx-auto flex size-14 items-center justify-center rounded-full text-lg font-bold">
                {step.stepNumber}
              </div>
              <h3 className="text-foreground mt-4 text-base font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
