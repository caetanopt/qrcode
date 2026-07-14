"use client";

import { textSchema, type TextPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { formatMessage } from "@/i18n/index";
import { useTranslations } from "@/i18n/I18nProvider";

interface TextFormProps {
  onValidChange: (payload: TextPayload) => void;
  onInvalid: () => void;
}

const MAX_LENGTH = 2000;

export function TextForm({ onValidChange, onInvalid }: TextFormProps) {
  const t = useTranslations();
  const { register, watch, formState } = useLiveForm<TextPayload>({
    schema: textSchema,
    defaultValues: { content: "" },
    onValidChange,
    onInvalid,
  });
  const content = watch("content") ?? "";

  return (
    <FormField
      label={t.form.text.label}
      required
      error={formState.errors.content && t.form.text.error}
      hint={formatMessage(t.form.text.counter, { count: content.length, max: MAX_LENGTH })}
    >
      {({ inputId, describedBy }) => (
        <Textarea
          id={inputId}
          aria-describedby={describedBy}
          invalid={Boolean(formState.errors.content)}
          placeholder={t.form.text.placeholder}
          maxLength={MAX_LENGTH}
          {...register("content")}
        />
      )}
    </FormField>
  );
}
