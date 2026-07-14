"use client";

import { eventSchema, type EventPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface EventFormProps {
  initialValues?: Partial<EventPayload>;
  onValidChange: (payload: EventPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<EventPayload>) => void;
}

const BLANK: EventPayload = {
  title: "",
  location: "",
  start: "",
  end: "",
  description: "",
  timezone: "Europe/Lisbon",
};

export function EventForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: EventFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<EventPayload>({
    schema: eventSchema,
    defaultValues: { ...BLANK, ...initialValues },
    blankValues: BLANK,
    onValidChange,
    onInvalid,
    onEmpty,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });

  const endError = !isBlank && formState.errors.end
    ? formState.errors.end.message === "errorEndBeforeStart"
      ? t.form.event.errorEndBeforeStart
      : t.form.event.errorRequired
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <FormField
        label={t.form.event.title}
        required
        error={!isBlank && formState.errors.title ? t.form.event.errorRequired : undefined}
      >
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            aria-describedby={describedBy}
            invalid={!isBlank && Boolean(formState.errors.title)}
            {...register("title")}
          />
        )}
      </FormField>
      <FormField label={t.form.event.location} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("location")} />}
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.form.event.start}
          required
          error={!isBlank && formState.errors.start ? t.form.event.errorRequired : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="datetime-local"
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.start)}
              // deps: "end before start" lives on the end field, so changing
              // the start date must re-evaluate it too.
              {...register("start", { deps: ["end"] })}
            />
          )}
        </FormField>
        <FormField label={t.form.event.end} required error={endError}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="datetime-local"
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.end)}
              {...register("end")}
            />
          )}
        </FormField>
      </div>
      <FormField label={t.form.event.description} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("description")} />}
      </FormField>
    </div>
  );
}
