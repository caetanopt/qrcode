"use client";

import { emailSchema, type EmailPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface EmailFormProps {
  initialValues?: Partial<EmailPayload>;
  onValidChange: (payload: EmailPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<EmailPayload>) => void;
}

const BLANK: EmailPayload = { address: "", subject: "", body: "" };

export function EmailForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: EmailFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<EmailPayload>({
    schema: emailSchema,
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
      <FormField label={t.form.email.address} required error={!isBlank && formState.errors.address ? t.form.email.error : undefined}>
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            type="email"
            aria-describedby={describedBy}
            invalid={!isBlank && Boolean(formState.errors.address)}
            {...register("address")}
          />
        )}
      </FormField>
      <FormField label={t.form.email.subject} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("subject")} />}
      </FormField>
      <FormField label={t.form.email.body} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("body")} />}
      </FormField>
    </div>
  );
}
