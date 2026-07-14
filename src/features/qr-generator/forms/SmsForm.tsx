"use client";

import { smsSchema, type SmsPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface SmsFormProps {
  onValidChange: (payload: SmsPayload) => void;
  onInvalid: () => void;
}

export function SmsForm({ onValidChange, onInvalid }: SmsFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<SmsPayload>({
    schema: smsSchema,
    defaultValues: { phone: "", message: "" },
    onValidChange,
    onInvalid,
  });

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t.form.sms.phone} required error={formState.errors.phone && t.form.sms.error}>
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
      <FormField label={t.form.sms.message} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("message")} />}
      </FormField>
    </div>
  );
}
