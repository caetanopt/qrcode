"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface FileUploadProps {
  label: string;
  hint?: string;
  accept: string;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ label, hint, accept, onFileSelected, disabled }: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    onFileSelected(file);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-cinza-antracite">
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan",
          dragActive ? "border-azul-cyan bg-azul-cyan-50" : "border-cinza-medio-200 hover:border-azul-profundo-100",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="text-sm font-medium text-azul-profundo">{label}</span>
        {hint && <span className="text-xs text-cinza-antracite-200">{hint}</span>}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
