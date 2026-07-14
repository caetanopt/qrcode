"use client";

import { urlSchema, type UrlPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "@/i18n/I18nProvider";

interface UrlFormProps {
  initialValues?: Partial<UrlPayload>;
  onValidChange: (payload: UrlPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<UrlPayload>) => void;
}

const BLANK: UrlPayload = { url: "", title: "" };

export function UrlForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: UrlFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<UrlPayload>({
    schema: urlSchema,
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
      <FormField label={t.form.url.label} required error={!isBlank && formState.errors.url ? t.form.url.error : undefined}>
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            aria-describedby={describedBy}
            invalid={!isBlank && Boolean(formState.errors.url)}
            placeholder={t.form.url.placeholder}
            {...register("url")}
          />
        )}
      </FormField>
      <FormField label={t.form.url.title} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} placeholder={t.form.url.titlePlaceholder} {...register("title")} />}
      </FormField>
    </div>
  );
}
