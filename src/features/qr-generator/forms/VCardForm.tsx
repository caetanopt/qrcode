"use client";

import { vcardSchema, type VCardPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/i18n/I18nProvider";

interface VCardFormProps {
  onValidChange: (payload: VCardPayload) => void;
  onInvalid: () => void;
}

export function VCardForm({ onValidChange, onInvalid }: VCardFormProps) {
  const t = useTranslations();
  const { register, formState } = useLiveForm<VCardPayload>({
    schema: vcardSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      organization: "",
      role: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      notes: "",
    },
    onValidChange,
    onInvalid,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t.form.vcard.firstName} required error={formState.errors.firstName && t.form.vcard.error}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              invalid={Boolean(formState.errors.firstName)}
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
        <FormField label={t.form.vcard.email} error={formState.errors.email?.message ? t.form.email.error : undefined}>
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
