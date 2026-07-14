"use client";

import { smsSchema, type SmsPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface SmsFormProps {
  initialValues?: Partial<SmsPayload>;
  onValidChange: (payload: SmsPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<SmsPayload>) => void;
}

const BLANK: SmsPayload = { phone: "", message: "" };

export function SmsForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: SmsFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<SmsPayload>({
    schema: smsSchema,
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
      <FormField label={t.form.sms.phone} required error={!isBlank && formState.errors.phone ? t.form.sms.error : undefined}>
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
      <FormField label={t.form.sms.message} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("message")} />}
      </FormField>
    </div>
  );
}
