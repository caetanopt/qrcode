"use client";

import type { QRCodeType } from "@/types/qr";
import { UrlForm } from "../forms/UrlForm";
import { TextForm } from "../forms/TextForm";
import { EmailForm } from "../forms/EmailForm";
import { PhoneForm } from "../forms/PhoneForm";
import { SmsForm } from "../forms/SmsForm";
import { WhatsappForm } from "../forms/WhatsappForm";
import { WifiForm } from "../forms/WifiForm";
import { VCardForm } from "../forms/VCardForm";
import { LocationForm } from "../forms/LocationForm";
import { EventForm } from "../forms/EventForm";

interface ContentFormProps {
  type: QRCodeType;
  onValidChange: (payload: Record<string, unknown>) => void;
  onInvalid: () => void;
}

export function ContentForm({ type, onValidChange, onInvalid }: ContentFormProps) {
  switch (type) {
    case "url":
      return <UrlForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "text":
      return <TextForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "email":
      return <EmailForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "phone":
      return <PhoneForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "sms":
      return <SmsForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "whatsapp":
      return <WhatsappForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "wifi":
      return <WifiForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "vcard":
      return <VCardForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "location":
      return <LocationForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    case "event":
      return <EventForm onValidChange={onValidChange} onInvalid={onInvalid} />;
    default:
      return null;
  }
}
