import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-600/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-stone-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-600/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-stone-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-stone-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-800">
      {children}
      {required && <span className="text-gold-600"> *</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-red-600">{children}</p>;
}
