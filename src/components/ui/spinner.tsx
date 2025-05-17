
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={cn("animate-spin rounded-full border-4 border-primary border-t-transparent", className)}>
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}
