"use client";

import { phoneSchema, type PhonePayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "@/i18n/I18nProvider";

interface PhoneFormProps {
  initialValues?: Partial<PhonePayload>;
  onValidChange: (payload: PhonePayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<PhonePayload>) => void;
}

const BLANK: PhonePayload = { phone: "" };

export function PhoneForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: PhoneFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<PhonePayload>({
    schema: phoneSchema,
    defaultValues: { ...BLANK, ...initialValues },
    blankValues: BLANK,
    onValidChange,
    onInvalid,
    onEmpty,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });

  return (
    <FormField label={t.form.phone.label} required error={!isBlank && formState.errors.phone ? t.form.phone.error : undefined}>
      {({ inputId, describedBy }) => (
        <Input
          id={inputId}
          type="tel"
          aria-describedby={describedBy}
          invalid={!isBlank && Boolean(formState.errors.phone)}
          placeholder={t.form.phone.placeholder}
          {...register("phone")}
        />
      )}
    </FormField>
  );
}
