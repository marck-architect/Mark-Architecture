/** Minimal, standards-compliant vCard 3.0 builder (RFC 2426). Pure and side-effect free. */

export interface VCardInput {
  name: string;
  title: string;
  company: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  website: string;
  address?: { street: string; city: string; country: string };
}

export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  let limit = 75;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function splitName(full: string): { given: string; family: string } {
  const words = full.trim().split(/\s+/);
  if (words.length === 1) return { given: words[0], family: "" };
  return { given: words.slice(0, -1).join(" "), family: words[words.length - 1] };
}

export function buildVCard(input: VCardInput): string {
  const { given, family } = splitName(input.name);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(family)};${escapeText(given)};;;`,
    `FN:${escapeText(input.name)}`,
    `ORG:${escapeText(input.company)}`,
    `TITLE:${escapeText(input.title)}`,
    `TEL;TYPE=CELL,VOICE:${input.phone}`,
  ];
  if (input.secondaryPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${input.secondaryPhone}`);
  }
  lines.push(`EMAIL;TYPE=INTERNET,WORK:${input.email}`);
  lines.push(`URL:${input.website}`);
  if (input.address) {
    const { street, city, country } = input.address;
    lines.push(
      `ADR;TYPE=WORK:;;${escapeText(street)};${escapeText(city)};;;${escapeText(country)}`,
    );
  }
  lines.push("END:VCARD");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function downloadVCard(vcard: string, fileName: string): void {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
