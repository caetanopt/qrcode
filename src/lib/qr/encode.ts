import type {
  EmailPayload,
  EventPayload,
  LocationPayload,
  PhonePayload,
  SmsPayload,
  TextPayload,
  UrlPayload,
  VCardPayload,
  WhatsappPayload,
  WifiPayload,
} from "@/lib/validation/schemas";

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function escapeVCardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function escapeIcsValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toIcsDate(isoValue: string): string {
  const date = new Date(isoValue);
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(
    date.getUTCDate(),
  ).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}${String(
    date.getUTCMinutes(),
  ).padStart(2, "0")}${String(date.getUTCSeconds()).padStart(2, "0")}Z`;
}

export function encodeUrl(payload: UrlPayload): string {
  return normalizeUrl(payload.url);
}

export function encodeText(payload: TextPayload): string {
  return payload.content;
}

export function encodeEmail(payload: EmailPayload): string {
  const params = new URLSearchParams();
  if (payload.subject) params.set("subject", payload.subject);
  if (payload.body) params.set("body", payload.body);
  const query = params.toString();
  return `mailto:${payload.address}${query ? `?${query}` : ""}`;
}

export function encodePhone(payload: PhonePayload): string {
  return `tel:${payload.phone.replace(/[\s()-]/g, "")}`;
}

export function encodeSms(payload: SmsPayload): string {
  const number = payload.phone.replace(/[\s()-]/g, "");
  return payload.message ? `sms:${number}?body=${encodeURIComponent(payload.message)}` : `sms:${number}`;
}

export function encodeWhatsapp(payload: WhatsappPayload): string {
  const digits = `${payload.countryCode.replace(/\D/g, "")}${payload.phone.replace(/\D/g, "")}`;
  const params = payload.message ? `?text=${encodeURIComponent(payload.message)}` : "";
  return `https://wa.me/${digits}${params}`;
}

export function encodeWifi(payload: WifiPayload): string {
  const security = payload.security === "nopass" ? "nopass" : payload.security;
  const parts = [
    `WIFI:T:${security}`,
    `S:${escapeWifiValue(payload.ssid)}`,
    security !== "nopass" ? `P:${escapeWifiValue(payload.password)}` : "",
    payload.hidden ? "H:true" : "",
  ].filter(Boolean);
  return `${parts.join(";")};;`;
}

export function encodeVCard(payload: VCardPayload): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(payload.lastName)};${escapeVCardValue(payload.firstName)};;;`,
    `FN:${escapeVCardValue(`${payload.firstName} ${payload.lastName}`.trim())}`,
  ];
  if (payload.organization) lines.push(`ORG:${escapeVCardValue(payload.organization)}`);
  if (payload.role) lines.push(`TITLE:${escapeVCardValue(payload.role)}`);
  if (payload.phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(payload.phone)}`);
  if (payload.email) lines.push(`EMAIL:${escapeVCardValue(payload.email)}`);
  if (payload.website) lines.push(`URL:${escapeVCardValue(normalizeUrl(payload.website))}`);
  if (payload.address) lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(payload.address)};;;;`);
  if (payload.notes) lines.push(`NOTE:${escapeVCardValue(payload.notes)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function encodeLocation(payload: LocationPayload): string {
  return `geo:${payload.latitude},${payload.longitude}${
    payload.description ? `?q=${payload.latitude},${payload.longitude}(${encodeURIComponent(payload.description)})` : ""
  }`;
}

export function encodeEvent(payload: EventPayload): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${escapeIcsValue(payload.title)}`,
    payload.location ? `LOCATION:${escapeIcsValue(payload.location)}` : "",
    `DTSTART:${toIcsDate(payload.start)}`,
    `DTEND:${toIcsDate(payload.end)}`,
    payload.description ? `DESCRIPTION:${escapeIcsValue(payload.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\n");
}
