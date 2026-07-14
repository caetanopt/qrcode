"use client";

import { textSchema, type TextPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { formatMessage } from "@/i18n/index";
import { useTranslations } from "@/i18n/I18nProvider";

interface TextFormProps {
  initialValues?: Partial<TextPayload>;
  onValidChange: (payload: TextPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<TextPayload>) => void;
}

const MAX_LENGTH = 2000;
const BLANK: TextPayload = { content: "" };

export function TextForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: TextFormProps) {
  const t = useTranslations();
  const { register, watch, formState, isBlank } = useLiveForm<TextPayload>({
    schema: textSchema,
    defaultValues: { ...BLANK, ...initialValues },
    blankValues: BLANK,
    onValidChange,
    onInvalid,
    onEmpty,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });
  const content = watch("content") ?? "";

  return (
    <FormField
      label={t.form.text.label}
      required
      error={!isBlank && formState.errors.content ? t.form.text.error : undefined}
      hint={formatMessage(t.form.text.counter, { count: content.length, max: MAX_LENGTH })}
    >
      {({ inputId, describedBy }) => (
        <Textarea
          id={inputId}
          aria-describedby={describedBy}
          invalid={!isBlank && Boolean(formState.errors.content)}
          placeholder={t.form.text.placeholder}
          maxLength={MAX_LENGTH}
          {...register("content")}
        />
      )}
    </FormField>
  );
}
