interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cinza-medio-200 px-6 py-10 text-center">
      {icon && (
        <div className="text-cinza-medio" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-cinza-antracite">{title}</p>
      {description && <p className="text-xs text-cinza-antracite-200">{description}</p>}
    </div>
  );
}
