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
  /** Fired on every keystroke, valid or not, so the draft can be kept when switching QR type. */
  onDraftChange?: (value: TValues) => void;
  /**
   * Treat the form as already touched from the first render — used when
   * `defaultValues` were restored from a saved draft, so invalid restored
   * content is reported immediately instead of being mistaken for a
   * pristine, untouched form.
   */
  startDirty?: boolean;
}

export function useLiveForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  onValidChange,
  onInvalid,
  onDraftChange,
  startDirty = false,
}: UseLiveFormArgs<TValues>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const { watch, formState } = form;
  const values = watch();
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;

  useEffect(() => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      onValidChange(parsed.data);
    }
    if (isDirty || startDirty) {
      // Only persist a draft (and report invalid content) once the user has
      // actually touched the form, or it started pre-filled from a restored
      // draft — a pristine, still-blank form isn't an error and shouldn't
      // overwrite the saved draft with blank values.
      onDraftChange?.(values);
      if (!parsed.success) {
        onInvalid?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), isValid, isDirty, startDirty]);

  return form;
}
