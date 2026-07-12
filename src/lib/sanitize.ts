import DOMPurify from "isomorphic-dompurify";
import validator from "validator";

export default function sanitize(value: string): string {
  const trimmed = value.trim();
  const escaped = validator.escape(trimmed);
  const purified = DOMPurify.sanitize(escaped);
  return purified;
}
