import { cn } from "@/lib/utils/cn";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "border-azul-cyan-100 bg-azul-cyan-50 text-azul-profundo",
  success: "border-verde-eco-100 bg-verde-eco-50 text-cinza-antracite",
  warning: "border-laranja-dinamico-100 bg-laranja-dinamico-50 text-cinza-antracite",
  error: "border-red-200 bg-red-50 text-red-700",
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3 text-sm", variantStyles[variant], className)}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
