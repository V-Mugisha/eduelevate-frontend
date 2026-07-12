import { Link } from "react-router-dom";
import { ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pt-32 lg:pb-36">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-muted/50 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
              <Code className="text-primary size-4" />
              Project-Based Tech Education
            </div>
          </div>

          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn to build software <span className="text-primary">by building software</span>
          </h1>

          <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
            EduElevate is a self-paced learning platform for Rwandan advanced-level secondary
            students. Take professional courses, write code in your browser, get instant feedback,
            and build a portfolio of real projects with mentorship from industry experts.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 absolute -top-40 right-0 -z-10 h-[400px] w-[400px] rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -bottom-20 left-0 -z-10 h-[300px] w-[300px] rounded-full blur-3xl" />
    </section>
  );
}
