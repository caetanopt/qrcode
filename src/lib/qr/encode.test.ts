import { describe, expect, it } from "vitest";
import {
  encodeEmail,
  encodeEvent,
  encodeLocation,
  encodePhone,
  encodeSms,
  encodeText,
  encodeUrl,
  encodeVCard,
  encodeWhatsapp,
  encodeWifi,
} from "./encode";

describe("encodeUrl", () => {
  it("normalizes bare domains to https", () => {
    expect(encodeUrl({ url: "exemplo.pt", title: "" })).toBe("https://exemplo.pt");
  });

  it("preserves an explicit protocol", () => {
    expect(encodeUrl({ url: "http://exemplo.pt", title: "" })).toBe("http://exemplo.pt");
  });
});

describe("encodeText", () => {
  it("returns the raw content", () => {
    expect(encodeText({ content: "Olá mundo" })).toBe("Olá mundo");
  });
});

describe("encodeEmail", () => {
  it("builds a mailto link with subject and body", () => {
    const result = encodeEmail({ address: "ana@exemplo.pt", subject: "Olá", body: "Como está?" });
    expect(result).toBe("mailto:ana@exemplo.pt?subject=Ol%C3%A1&body=Como+est%C3%A1%3F");
  });

  it("omits query string when subject and body are empty", () => {
    expect(encodeEmail({ address: "ana@exemplo.pt", subject: "", body: "" })).toBe("mailto:ana@exemplo.pt");
  });
});

describe("encodePhone", () => {
  it("strips formatting characters", () => {
    expect(encodePhone({ phone: "+351 912 345 678" })).toBe("tel:+351912345678");
  });
});

describe("encodeSms", () => {
  it("includes the message when provided", () => {
    expect(encodeSms({ phone: "912345678", message: "Olá" })).toBe("sms:912345678?body=Ol%C3%A1");
  });

  it("omits the body param when there is no message", () => {
    expect(encodeSms({ phone: "912345678", message: "" })).toBe("sms:912345678");
  });
});

describe("encodeWhatsapp", () => {
  it("builds a wa.me link from country code and phone", () => {
    expect(encodeWhatsapp({ countryCode: "+351", phone: "912 345 678", message: "" })).toBe(
      "https://wa.me/351912345678",
    );
  });

  it("url-encodes the predefined message", () => {
    expect(encodeWhatsapp({ countryCode: "351", phone: "912345678", message: "Olá!" })).toBe(
      "https://wa.me/351912345678?text=Ol%C3%A1!",
    );
  });
});

describe("encodeWifi", () => {
  it("builds a WIFI: payload with escaped special characters", () => {
    expect(encodeWifi({ ssid: "Rede;Caetano", password: "senha,123", security: "WPA2", hidden: false })).toBe(
      "WIFI:T:WPA2;S:Rede\\;Caetano;P:senha\\,123;;",
    );
  });

  it("omits the password field for open networks", () => {
    expect(encodeWifi({ ssid: "Rede Aberta", password: "", security: "nopass", hidden: true })).toBe(
      "WIFI:T:nopass;S:Rede Aberta;H:true;;",
    );
  });
});

describe("encodeVCard", () => {
  it("builds a vCard 3.0 payload with the provided fields", () => {
    const result = encodeVCard({
      firstName: "Ana",
      lastName: "Silva",
      organization: "Caetano",
      role: "Gestora",
      phone: "912345678",
      email: "ana@caetano.pt",
      website: "caetano.pt",
      address: "Rua Exemplo, 1",
      notes: "Contacto preferencial",
    });
    expect(result).toContain("BEGIN:VCARD");
    expect(result).toContain("FN:Ana Silva");
    expect(result).toContain("ORG:Caetano");
    expect(result).toContain("URL:https://caetano.pt");
    expect(result).toContain("END:VCARD");
  });
});

describe("encodeLocation", () => {
  it("builds a geo: URI", () => {
    expect(encodeLocation({ latitude: 41.1579, longitude: -8.6291, description: "" })).toBe("geo:41.1579,-8.6291");
  });
});

describe("encodeEvent", () => {
  it("builds an iCalendar VEVENT payload", () => {
    const result = encodeEvent({
      title: "Lançamento",
      location: "Porto",
      start: "2026-09-01T10:00:00.000Z",
      end: "2026-09-01T12:00:00.000Z",
      description: "Evento de lançamento",
      timezone: "Europe/Lisbon",
    });
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("SUMMARY:Lançamento");
    expect(result).toContain("DTSTART:20260901T100000Z");
    expect(result).toContain("DTEND:20260901T120000Z");
  });
});
