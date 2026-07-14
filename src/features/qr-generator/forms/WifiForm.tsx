"use client";

import { useState } from "react";
import { wifiSchema, type WifiPayload } from "@/lib/validation/schemas";
import { useLiveForm } from "../hooks/useLiveForm";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/i18n/I18nProvider";

interface WifiFormProps {
  onValidChange: (payload: WifiPayload) => void;
  onInvalid: () => void;
}

const SECURITY_VALUES: WifiPayload["security"][] = ["WPA2", "WPA3", "WPA", "WEP", "nopass"];

export function WifiForm({ onValidChange, onInvalid }: WifiFormProps) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const { register, watch, setValue, formState } = useLiveForm<WifiPayload>({
    schema: wifiSchema,
    defaultValues: { ssid: "", password: "", security: "WPA2", hidden: false },
    onValidChange,
    onInvalid,
  });

  const security = watch("security");
  const hidden = watch("hidden");

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t.form.wifi.ssid} required error={formState.errors.ssid && t.form.wifi.error}>
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            aria-describedby={describedBy}
            invalid={Boolean(formState.errors.ssid)}
            {...register("ssid")}
          />
        )}
      </FormField>

      <FormField label={t.form.wifi.security}>
        {({ inputId }) => (
          <Select
            id={inputId}
            options={SECURITY_VALUES.map((value) => ({
              value,
              label: value === "nopass" ? "Sem palavra-passe" : value,
            }))}
            value={security}
            {...register("security")}
          />
        )}
      </FormField>

      {security !== "nopass" && (
        <FormField label={t.form.wifi.password}>
          {({ inputId }) => (
            <div className="flex gap-2">
              <Input id={inputId} type={showPassword ? "text" : "password"} {...register("password")} />
              <Button
                type="button"
                variant="secondary"
                size="md"
                aria-label={t.a11y.togglePasswordVisibility}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "🙈" : "👁"}
              </Button>
            </div>
          )}
        </FormField>
      )}

      <Toggle
        checked={hidden}
        onChange={(value) => setValue("hidden", value, { shouldValidate: true, shouldDirty: true })}
        label={t.form.wifi.hidden}
      />
    </div>
  );
}
