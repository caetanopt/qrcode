"use client";

import { vcardSchema, type VCardPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface VCardFormProps {
  initialValues?: Partial<VCardPayload>;
  onValidChange: (payload: VCardPayload) => void;
  onInvalid: () => void;
  onEmpty: () => void;
  onDraftChange: (payload: Partial<VCardPayload>) => void;
}

const BLANK: VCardPayload = {
  firstName: "",
  lastName: "",
  organization: "",
  role: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  notes: "",
};

export function VCardForm({ initialValues, onValidChange, onInvalid, onEmpty, onDraftChange }: VCardFormProps) {
  const t = useTranslations();
  const { register, formState, isBlank } = useLiveForm<VCardPayload>({
    schema: vcardSchema,
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
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.form.vcard.firstName}
          required
          error={!isBlank && formState.errors.firstName ? t.form.vcard.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              invalid={!isBlank && Boolean(formState.errors.firstName)}
              {...register("firstName")}
            />
          )}
        </FormField>
        <FormField label={t.form.vcard.lastName} hint={t.common.optional}>
          {({ inputId }) => <Input id={inputId} {...register("lastName")} />}
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t.form.vcard.organization} hint={t.common.optional}>
          {({ inputId }) => <Input id={inputId} {...register("organization")} />}
        </FormField>
        <FormField label={t.form.vcard.role} hint={t.common.optional}>
          {({ inputId }) => <Input id={inputId} {...register("role")} />}
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t.form.vcard.phone} hint={t.common.optional}>
          {({ inputId }) => <Input id={inputId} type="tel" {...register("phone")} />}
        </FormField>
        <FormField
          label={t.form.vcard.email}
          error={!isBlank && formState.errors.email?.message ? t.form.email.error : undefined}
        >
          {({ inputId, describedBy }) => (
            <Input id={inputId} type="email" aria-describedby={describedBy} {...register("email")} />
          )}
        </FormField>
      </div>
      <FormField label={t.form.vcard.website} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("website")} />}
      </FormField>
      <FormField label={t.form.vcard.address} hint={t.common.optional}>
        {({ inputId }) => <Input id={inputId} {...register("address")} />}
      </FormField>
      <FormField label={t.form.vcard.notes} hint={t.common.optional}>
        {({ inputId }) => <Textarea id={inputId} {...register("notes")} />}
      </FormField>
    </div>
  );
}
