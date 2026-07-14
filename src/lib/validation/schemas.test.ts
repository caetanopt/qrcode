import { describe, expect, it } from "vitest";
import {
  emailSchema,
  eventSchema,
  locationSchema,
  urlSchema,
  wifiSchema,
} from "./schemas";

describe("urlSchema", () => {
  it("accepts a bare domain", () => {
    expect(urlSchema.safeParse({ url: "exemplo.pt" }).success).toBe(true);
  });

  it("rejects an empty value", () => {
    expect(urlSchema.safeParse({ url: "" }).success).toBe(false);
  });

  it("rejects a non-http protocol", () => {
    expect(urlSchema.safeParse({ url: "ftp://exemplo.pt" }).success).toBe(false);
  });
});

describe("emailSchema", () => {
  it("rejects an invalid address", () => {
    expect(emailSchema.safeParse({ address: "not-an-email" }).success).toBe(false);
  });

  it("accepts a valid address without subject or body", () => {
    expect(emailSchema.safeParse({ address: "ana@exemplo.pt" }).success).toBe(true);
  });
});

describe("wifiSchema", () => {
  it("defaults security to WPA2", () => {
    const result = wifiSchema.safeParse({ ssid: "Rede" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.security).toBe("WPA2");
    }
  });

  it("rejects a missing ssid", () => {
    expect(wifiSchema.safeParse({ ssid: "" }).success).toBe(false);
  });
});

describe("locationSchema", () => {
  it("rejects latitude out of range", () => {
    expect(locationSchema.safeParse({ latitude: 120, longitude: 0 }).success).toBe(false);
  });

  it("rejects longitude out of range", () => {
    expect(locationSchema.safeParse({ latitude: 0, longitude: 200 }).success).toBe(false);
  });

  it("accepts valid coordinates", () => {
    expect(locationSchema.safeParse({ latitude: 41.15, longitude: -8.6 }).success).toBe(true);
  });
});

describe("eventSchema", () => {
  const base = {
    title: "Lançamento",
    location: "Porto",
    description: "",
    timezone: "Europe/Lisbon",
  };

  it("rejects an end date before the start date", () => {
    const result = eventSchema.safeParse({
      ...base,
      start: "2026-09-01T12:00:00.000Z",
      end: "2026-09-01T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an end date after the start date", () => {
    const result = eventSchema.safeParse({
      ...base,
      start: "2026-09-01T10:00:00.000Z",
      end: "2026-09-01T12:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});
