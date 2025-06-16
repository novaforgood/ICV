import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiCheckboxProps {
  options: {
    label: string
    value: string
  }[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function MultiCheckbox({
  options,
  selectedValues,
  onChange,
  className,
}: MultiCheckboxProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md"
        >
          <div
            className={cn(
              "h-4 w-4 rounded border border-input flex items-center justify-center",
              selectedValues.includes(option.value) && "bg-primary border-primary"
            )}
            onClick={() => toggleValue(option.value)}
          >
            {selectedValues.includes(option.value) && (
              <Check className="h-3 w-3 text-primary-foreground" />
            )}
          </div>
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  )
} 