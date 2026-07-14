"use client";

import { locationSchema, type LocationPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "@/i18n/I18nProvider";

interface LocationFormProps {
  initialValues?: Partial<LocationPayload>;
  onValidChange: (payload: LocationPayload) => void;
  onInvalid: () => void;
  onDraftChange: (payload: Partial<LocationPayload>) => void;
}

export function LocationForm({ initialValues, onValidChange, onInvalid, onDraftChange }: LocationFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<LocationPayload>({
    schema: locationSchema,
    defaultValues: { latitude: 0, longitude: 0, description: "", ...initialValues },
    onValidChange,
    onInvalid,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t.form.location.latitude} required error={formState.errors.latitude && t.form.location.error}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="number"
              step="any"
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.latitude)}
              {...register("latitude")}
            />
          )}
        </FormField>
        <FormField label={t.form.location.longitude} required error={formState.errors.longitude && t.form.location.error}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="number"
              step="any"
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.longitude)}
              {...register("longitude")}
            />
          )}
        </FormField>
      </div>
      <FormField label={t.form.location.description} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("description")} />}
      </FormField>
    </div>
  );
}
