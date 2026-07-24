import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, ChevronRight, Calendar } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { listCertificates } from "./services/certificateService";
import type { Certificate } from "./types/coursesTypes";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listCertificates()
      .then(setCertificates)
      .catch(() => setCertificates([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Certificates</h1>
        <p className="mt-1 text-muted-foreground">Certificates you have earned by completing courses</p>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Award className="size-12 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">No certificates yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a course to earn a certificate.
          </p>
          <Link to="/courses" className="mt-4">
            <span className="text-sm text-primary hover:underline">Browse Courses</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Link
              key={cert.id}
              to={`/certificates/${cert.id}`}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span className="text-xs font-medium text-primary">Certificate</span>
              </div>
              <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                {cert.course.title}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDate(cert.issuedAt)}
                </span>
                <ChevronRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
