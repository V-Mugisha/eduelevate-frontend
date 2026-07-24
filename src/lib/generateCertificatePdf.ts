import jsPDF from "jspdf";

interface CertificatePdfData {
  studentName: string;
  courseTitle: string;
  educatorName: string;
  issuedAt: string;
  certificateId: string;
}

function drawDividerLine(doc: jsPDF, y: number) {
  const w = 1056;
  const cx = w / 2;

  doc.setDrawColor("#94a3b8");
  doc.setLineWidth(1);
  doc.line(cx - 80, y, cx - 12, y);
  doc.line(cx + 12, y, cx + 80, y);

  doc.setDrawColor("#eab308");
  doc.setLineWidth(1.5);

  const size = 5;
  const top = y - size;
  const bottom = y + size;
  const left = cx - size;
  const right = cx + size;

  doc.triangle(cx, top, right, y, cx, bottom, "DF");
  doc.triangle(cx, top, left, y, cx, bottom, "DF");
}

export function generateCertificatePdf(data: CertificatePdfData, filename: string) {
  const doc = new jsPDF({ orientation: "landscape", unit: "px", format: [1056, 816] });

  const w = 1056;
  const h = 816;

  doc.setFillColor("#0f172a");
  doc.rect(0, 0, w, h, "F");

  doc.setFillColor("#1e293b");
  doc.roundedRect(24, 24, w - 48, h - 48, 12, 12, "F");

  doc.setDrawColor("#eab308");
  doc.setLineWidth(3);
  doc.roundedRect(24, 24, w - 48, h - 48, 12, 12, "D");

  doc.setDrawColor("#eab308");
  doc.setLineWidth(0.5);
  doc.roundedRect(40, 40, w - 80, h - 80, 8, 8, "D");

  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.setTextColor("#eab308");
  doc.text("EduElevate", w / 2, 130, { align: "center" });

  drawDividerLine(doc, 158);

  doc.setFont("times", "bold");
  doc.setFontSize(36);
  doc.setTextColor("#f1f5f9");
  doc.text("Certificate of Completion", w / 2, 210, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.setTextColor("#94a3b8");
  doc.text("This certifies that", w / 2, 258, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(44);
  doc.setTextColor("#f1f5f9");
  doc.text(data.studentName, w / 2, 318, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.setTextColor("#94a3b8");
  doc.text("has successfully completed", w / 2, 358, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor("#eab308");
  doc.text(data.courseTitle, w / 2, 408, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.setTextColor("#94a3b8");
  doc.text("Taught by: " + data.educatorName, w / 2, 456, { align: "center" });
  doc.text("Issued on: " + data.issuedAt, w / 2, 480, { align: "center" });

  drawDividerLine(doc, 524);

  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor("#64748b");
  doc.text(
    "Congratulations on your outstanding achievement. Your dedication and hard work",
    w / 2,
    566,
    { align: "center" },
  );
  doc.text(
    "have earned you this certificate of completion from EduElevate.",
    w / 2,
    586,
    { align: "center" },
  );

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#475569");
  doc.text("Certificate ID: " + data.certificateId, w / 2, 650, { align: "center" });

  doc.setFontSize(8);
  doc.text("EduElevate  -  Project-Based Tech Education", w / 2, 680, { align: "center" });

  doc.save(filename);
}
