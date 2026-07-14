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
  initialValues: Record<string, unknown> | undefined;
  onValidChange: (payload: Record<string, unknown>) => void;
  onInvalid: () => void;
  onDraftChange: (payload: Record<string, unknown>) => void;
}

export function ContentForm({ type, initialValues, onValidChange, onInvalid, onDraftChange }: ContentFormProps) {
  switch (type) {
    case "url":
      return (
        <UrlForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "text":
      return (
        <TextForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "email":
      return (
        <EmailForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "phone":
      return (
        <PhoneForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "sms":
      return (
        <SmsForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "whatsapp":
      return (
        <WhatsappForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "wifi":
      return (
        <WifiForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "vcard":
      return (
        <VCardForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "location":
      return (
        <LocationForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    case "event":
      return (
        <EventForm
          initialValues={initialValues}
          onValidChange={onValidChange}
          onInvalid={onInvalid}
          onDraftChange={onDraftChange}
        />
      );
    default:
      return null;
  }
}
