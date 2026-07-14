"use client";

import { whatsappSchema, type WhatsappPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface WhatsappFormProps {
  onValidChange: (payload: WhatsappPayload) => void;
  onInvalid: () => void;
}

export function WhatsappForm({ onValidChange, onInvalid }: WhatsappFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<WhatsappPayload>({
    schema: whatsappSchema,
    defaultValues: { countryCode: "+351", phone: "", message: "" },
    onValidChange,
    onInvalid,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.form.whatsapp.countryCode}
          required
          error={formState.errors.countryCode && t.form.whatsapp.error}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.countryCode)}
              {...register("countryCode")}
            />
          )}
        </FormField>
        <FormField label={t.form.whatsapp.phone} required error={formState.errors.phone && t.form.whatsapp.error}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="tel"
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.phone)}
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
