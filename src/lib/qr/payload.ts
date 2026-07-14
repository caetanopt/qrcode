import type { z } from "zod";
import type { QRCodeType } from "@/types/qr";
import { payloadSchemas } from "@/lib/validation/schemas";
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
} from "@/lib/qr/encode";

type PayloadOf<T extends QRCodeType> = z.infer<(typeof payloadSchemas)[T]>;

const encoders: { [K in QRCodeType]: (payload: PayloadOf<K>) => string } = {
  url: encodeUrl,
  text: encodeText,
  email: encodeEmail,
  phone: encodePhone,
  sms: encodeSms,
  whatsapp: encodeWhatsapp,
  wifi: encodeWifi,
  vcard: encodeVCard,
  location: encodeLocation,
  event: encodeEvent,
};

export function encodePayload<T extends QRCodeType>(type: T, payload: PayloadOf<T>): string {
  const encoder = encoders[type] as (value: PayloadOf<T>) => string;
  return encoder(payload);
}

export function parsePayload<T extends QRCodeType>(
  type: T,
  data: unknown,
): { success: true; data: PayloadOf<T> } | { success: false; error: z.ZodError } {
  const schema = payloadSchemas[type];
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as PayloadOf<T> };
  }
  return { success: false, error: result.error };
}
