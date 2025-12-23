"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/design-tokens";
import { type VariantProps, cva } from "class-variance-authority";

const dropdownTriggerVariants = cva(
  "inline-flex items-center justify-between gap-2 font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-surface-secondary border border-border text-text-primary hover:bg-surface-hover focus:ring-accent dark:bg-surface-dark-secondary dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-surface-dark-hover dark:focus:ring-accent-dark",
        ghost:
          "hover:bg-surface-hover text-text-primary dark:hover:bg-surface-dark-hover dark:text-text-primary-dark",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-button",
        lg: "h-12 px-6 text-base rounded-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps extends VariantProps<typeof dropdownTriggerVariants> {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select...",
      variant,
      size,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setOpen(false);
    };

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            className={cn(dropdownTriggerVariants({ variant, size, className }))}
            aria-label="Open dropdown"
          >
            <span className="flex-1 text-left">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 min-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-button border shadow-lg",
              "bg-surface-primary border-border dark:bg-surface-dark-primary dark:border-border-dark",
              "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            sideOffset={4}
            align="start"
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-mono outline-none transition-colors",
                    "hover:bg-surface-hover focus:bg-surface-hover dark:hover:bg-surface-dark-hover dark:focus:bg-surface-dark-hover",
                    "disabled:pointer-events-none disabled:opacity-50",
                    value === option.value &&
                      "bg-accent/10 text-accent dark:bg-accent-dark/10 dark:text-accent-dark"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownOption };
