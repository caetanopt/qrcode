"use client";

import type { DefaultValues } from "react-hook-form";
import { locationSchema, type LocationPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "@/i18n/I18nProvider";

interface LocationFormProps {
  initialValues?: Partial<LocationPayload>;
  onValidChange: (payload: LocationPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<LocationPayload>) => void;
}

// Coordinates start blank on purpose (never a silent 0,0). The inputs yield
// strings at runtime and the schema coerces them, so "" is the honest blank
// value even though the payload type says number.
const BLANK = { latitude: "", longitude: "", description: "" } as unknown as LocationPayload;

export function LocationForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: LocationFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<LocationPayload>({
    schema: locationSchema,
    defaultValues: { ...BLANK, ...initialValues } as unknown as DefaultValues<LocationPayload>,
    blankValues: BLANK,
    onValidChange,
    onInvalid,
    onEmpty,
    onDraftChange,
    startDirty: Boolean(initialValues && Object.keys(initialValues).length > 0),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.form.location.latitude}
          required
          error={!isBlank && formState.errors.latitude ? t.form.location.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="number"
              step="any"
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.latitude)}
              {...register("latitude")}
            />
          )}
        </FormField>
        <FormField
          label={t.form.location.longitude}
          required
          error={!isBlank && formState.errors.longitude ? t.form.location.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="number"
              step="any"
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.longitude)}
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
