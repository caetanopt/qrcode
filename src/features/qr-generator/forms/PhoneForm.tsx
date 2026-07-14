"use client";

import { phoneSchema, type PhonePayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "@/i18n/I18nProvider";

interface PhoneFormProps {
  onValidChange: (payload: PhonePayload) => void;
  onInvalid: () => void;
}

export function PhoneForm({ onValidChange, onInvalid }: PhoneFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<PhonePayload>({
    schema: phoneSchema,
    defaultValues: { phone: "" },
    onValidChange,
    onInvalid,
  });

  return (
    <FormField label={t.form.phone.label} required error={formState.errors.phone && t.form.phone.error}>
      {({ inputId, describedBy }) => (
        <Input
          id={inputId}
          type="tel"
          aria-describedby={describedBy}
          invalid={Boolean(formState.errors.phone)}
          placeholder={t.form.phone.placeholder}
          {...register("phone")}
        />
      )}
    </FormField>
  );
}
