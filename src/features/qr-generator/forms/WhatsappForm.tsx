"use client";

import { whatsappSchema, type WhatsappPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface WhatsappFormProps {
  initialValues?: Partial<WhatsappPayload>;
  onValidChange: (payload: WhatsappPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<WhatsappPayload>) => void;
}

const BLANK: WhatsappPayload = { countryCode: "+351", phone: "", message: "" };

export function WhatsappForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: WhatsappFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<WhatsappPayload>({
    schema: whatsappSchema,
    defaultValues: { ...BLANK, ...initialValues },
    blankValues: BLANK,
    onValidChange,
    onInvalid,
    onEmpty,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.form.whatsapp.countryCode}
          required
          error={!isBlank && formState.errors.countryCode ? t.form.whatsapp.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.countryCode)}
              {...register("countryCode")}
            />
          )}
        </FormField>
        <FormField
          label={t.form.whatsapp.phone}
          required
          error={!isBlank && formState.errors.phone ? t.form.whatsapp.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="tel"
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.phone)}
              {...register("phone")}
            />
          )}
        </FormField>
      </div>
      <FormField label={t.form.whatsapp.message} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("message")} />}
      </FormField>
    </div>
  );
}
