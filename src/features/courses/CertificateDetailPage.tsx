import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { getCertificate } from "./services/certificateService";
import { generateCertificatePdf } from "@/lib/generateCertificatePdf";
import type { Certificate } from "./types/coursesTypes";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DividerLine() {
  return (
    <div className="my-3 flex items-center justify-center gap-1">
      <div className="h-px w-16 bg-[#94a3b8]" />
      <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#eab308]">
        <polygon points="7,0 9,5 14,7 9,9 7,14 5,9 0,7 5,5" fill="currentColor" />
      </svg>
      <div className="h-px w-16 bg-[#94a3b8]" />
    </div>
  );
}

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCertificate(id)
      .then(setCertificate)
      .catch(() => setError("Failed to load certificate."))
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleDownload() {
    if (!certificate) return;
    generateCertificatePdf(
      {
        studentName: `${certificate.user.firstName} ${certificate.user.lastName}`,
        courseTitle: certificate.course.title,
        educatorName: `${certificate.course.creator.firstName} ${certificate.course.creator.lastName}`,
        issuedAt: formatDate(certificate.issuedAt),
        certificateId: certificate.id,
      },
      `certificate-${certificate.user.firstName}-${certificate.user.lastName}.pdf`,
    );
  }

  if (isLoading) return <LoadingBubbles size="lg" />;

  if (error || !certificate) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">{error ?? "Certificate not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/certificates")} className="mb-4 -ml-3">
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Certificates
      </Button>

      <div className="overflow-hidden rounded-xl bg-[#0f172a] p-6 sm:p-12">
        <div className="rounded-lg border-2 border-[#eab308] p-6 sm:p-10">
          <div className="rounded border border-[#eab308]/40 p-6 sm:p-8">
            <p
              className="text-center text-4xl text-[#eab308] sm:text-5xl"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              EduElevate
            </p>
            <DividerLine />
            <p
              className="mt-3 text-center text-2xl font-bold text-[#f1f5f9] sm:text-3xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Certificate of Completion
            </p>
            <p
              className="mt-6 text-center text-sm text-[#94a3b8] sm:text-base"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              This certifies that
            </p>
            <p
              className="mt-2 text-center text-3xl font-bold text-[#f1f5f9] sm:text-4xl"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {certificate.user.firstName} {certificate.user.lastName}
            </p>
            <p
              className="mt-2 text-center text-sm text-[#94a3b8] sm:text-base"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              has successfully completed
            </p>
            <p
              className="mt-2 text-center text-2xl font-bold text-[#eab308] sm:text-3xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {certificate.course.title}
            </p>
            <p
              className="mt-4 text-center text-sm text-[#94a3b8]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Taught by: {certificate.course.creator.firstName}{" "}
              {certificate.course.creator.lastName}
            </p>
            <p
              className="mt-1 text-center text-sm text-[#94a3b8]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Issued on: {formatDate(certificate.issuedAt)}
            </p>
            <DividerLine />
            <p
              className="mt-3 text-center text-[13px] italic text-[#64748b]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Congratulations on your outstanding achievement. Your dedication and hard work have
              earned you this certificate of completion from EduElevate.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/courses/${certificate.course.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <BookOpen className="size-4" />
          <span>{certificate.course.title}</span>
        </Link>
        <Button onClick={handleDownload} size="lg">
          <Download className="mr-2 size-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
