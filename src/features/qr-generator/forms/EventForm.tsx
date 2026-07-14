"use client";

import { eventSchema, type EventPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface EventFormProps {
  onValidChange: (payload: EventPayload) => void;
  onInvalid: () => void;
}

export function EventForm({ onValidChange, onInvalid }: EventFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<EventPayload>({
    schema: eventSchema,
    defaultValues: {
      title: "",
      location: "",
      start: "",
      end: "",
      description: "",
      timezone: "Europe/Lisbon",
    },
    onValidChange,
    onInvalid,
  });

  const endError = formState.errors.end
    ? formState.errors.end.message === "errorEndBeforeStart"
      ? t.form.event.errorEndBeforeStart
      : t.form.event.errorRequired
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t.form.event.title} required error={formState.errors.title && t.form.event.errorRequired}>
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            aria-describedby={describedBy}
            invalid={Boolean(formState.errors.title)}
            {...register("title")}
          />
        )}
      </FormField>
      <FormField label={t.form.event.location} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("location")} />}
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t.form.event.start} required error={formState.errors.start && t.form.event.errorRequired}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="datetime-local"
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.start)}
              {...register("start")}
            />
          )}
        </FormField>
        <FormField label={t.form.event.end} required error={endError}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="datetime-local"
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.end)}
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
