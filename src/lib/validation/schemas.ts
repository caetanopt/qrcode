import { z } from "zod";

const urlLike = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => {
      // Any other explicit scheme (ftp:, javascript:, ...) must be rejected
      // outright rather than treated as a bare domain to prepend https:// to.
      if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) {
        return false;
      }
      try {
        const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
        const url = new URL(withProtocol);
        return /^https?:$/.test(url.protocol);
      } catch {
        return false;
      }
    },
    { message: "url" },
  );

export const urlSchema = z.object({
  url: urlLike,
  title: z.string().trim().max(80).optional().default(""),
});
export type UrlPayload = z.infer<typeof urlSchema>;

export const textSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});
export type TextPayload = z.infer<typeof textSchema>;

const emailAddress = z.string().trim().email();

export const emailSchema = z.object({
  address: emailAddress,
  subject: z.string().trim().max(200).optional().default(""),
  body: z.string().trim().max(2000).optional().default(""),
});
export type EmailPayload = z.infer<typeof emailSchema>;

const phoneNumber = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^\+?[0-9()\s-]+$/, { message: "phone" });

export const phoneSchema = z.object({
  phone: phoneNumber,
});
export type PhonePayload = z.infer<typeof phoneSchema>;

export const smsSchema = z.object({
  phone: phoneNumber,
  message: z.string().trim().max(500).optional().default(""),
});
export type SmsPayload = z.infer<typeof smsSchema>;

export const whatsappSchema = z.object({
  countryCode: z
    .string()
    .trim()
    .min(1)
    .max(5)
    .regex(/^\+?[0-9]+$/, { message: "countryCode" }),
  phone: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[0-9\s-]+$/, { message: "phone" }),
  message: z.string().trim().max(500).optional().default(""),
});
export type WhatsappPayload = z.infer<typeof whatsappSchema>;

export const wifiSchema = z
  .object({
    ssid: z.string().trim().min(1).max(64),
    password: z.string().max(64).optional().default(""),
    security: z.enum(["WPA", "WPA2", "WPA3", "WEP", "nopass"]).default("WPA2"),
    hidden: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // A protected network with an empty password would produce a QR code that
    // scans fine but can never join the network.
    if (data.security !== "nopass" && data.password.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "passwordRequired", path: ["password"] });
    }
  });
export type WifiPayload = z.infer<typeof wifiSchema>;

export const vcardSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().max(60).optional().default(""),
  organization: z.string().trim().max(100).optional().default(""),
  role: z.string().trim().max(100).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  email: z.union([emailAddress, z.literal("")]).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  address: z.string().trim().max(200).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
});
export type VCardPayload = z.infer<typeof vcardSchema>;

// Blank input must be rejected, not silently coerced to 0 (coordinates 0,0).
const coordinate = (min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.coerce.number().min(min).max(max),
  );

export const locationSchema = z.object({
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
  description: z.string().trim().max(200).optional().default(""),
});
export type LocationPayload = z.infer<typeof locationSchema>;

export const eventSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    location: z.string().trim().max(200).optional().default(""),
    start: z.string().trim().min(1),
    end: z.string().trim().min(1),
    description: z.string().trim().max(1000).optional().default(""),
    timezone: z.string().trim().min(1).default("Europe/Lisbon"),
  })
  .refine((data) => new Date(data.end).getTime() > new Date(data.start).getTime(), {
    message: "errorEndBeforeStart",
    path: ["end"],
  });
export type EventPayload = z.infer<typeof eventSchema>;

export const payloadSchemas = {
  url: urlSchema,
  text: textSchema,
  email: emailSchema,
  phone: phoneSchema,
  sms: smsSchema,
  whatsapp: whatsappSchema,
  wifi: wifiSchema,
  vcard: vcardSchema,
  location: locationSchema,
  event: eventSchema,
} as const;
