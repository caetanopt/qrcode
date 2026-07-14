"use client";

import { emailSchema, type EmailPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface EmailFormProps {
  onValidChange: (payload: EmailPayload) => void;
  onInvalid: () => void;
}

export function EmailForm({ onValidChange, onInvalid }: EmailFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<EmailPayload>({
    schema: emailSchema,
    defaultValues: { address: "", subject: "", body: "" },
    onValidChange,
    onInvalid,
  });

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t.form.email.address} required error={formState.errors.address && t.form.email.error}>
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            type="email"
            aria-describedby={describedBy}
            invalid={Boolean(formState.errors.address)}
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
