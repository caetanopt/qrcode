"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";
import { useEffect } from "react";

interface UseLiveFormArgs<TValues extends FieldValues> {
  schema: ZodType<TValues, ZodTypeDef, unknown>;
  defaultValues: DefaultValues<TValues>;
  onValidChange: (value: TValues) => void;
  onInvalid?: () => void;
}

export function useLiveForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  onValidChange,
  onInvalid,
}: UseLiveFormArgs<TValues>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const { watch, formState } = form;
  const values = watch();
  const isValid = formState.isValid;

  useEffect(() => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      onValidChange(parsed.data);
    } else {
      onInvalid?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), isValid]);

  return form;
}
