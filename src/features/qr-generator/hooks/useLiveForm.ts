"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues, type Resolver } from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";
import { useEffect } from "react";

interface UseLiveFormArgs<TValues extends FieldValues> {
  // Input differs from Output for schemas with optional/defaulted fields
  // (e.g. subject?: string defaulting to "") or preprocessed fields (e.g.
  // coordinates accepting unknown before coercion), which @hookform/resolvers'
  // stricter v5 typings can't express in a single TValues generic here
  // without reshaping every form's register()/watch() types. The resolver
  // cast below is the one place that absorbs that mismatch; behavior at
  // runtime is unaffected.
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
  const resolver = zodResolver(schema as never) as unknown as Resolver<TValues, unknown, TValues>;
  const form = useForm<TValues>({
    resolver,
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
