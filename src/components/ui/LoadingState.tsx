interface LoadingStateProps {
  label: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-azul-profundo border-t-transparent"
        aria-hidden="true"
      />
      <p className="text-sm text-cinza-antracite-200">{label}</p>
    </div>
  );
}
