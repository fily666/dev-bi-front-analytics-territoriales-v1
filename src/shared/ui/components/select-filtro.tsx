'use client';

import { cn } from '@/shared/ui/utils/cn';
import { ChevronDown } from 'lucide-react';
import { ChangeEvent } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFiltroProps {
  label: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SelectFiltro({
  label,
  value,
  options,
  onChange,
  placeholder = 'Todos',
  disabled = false,
  loading = false,
  className,
}: SelectFiltroProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value === '' ? null : e.target.value);
  };

  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
        {label}
      </span>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled || loading}
          className={cn(
            'h-10 w-full appearance-none truncate rounded-lg border border-border bg-surface pl-3 pr-8 text-sm text-foreground shadow-soft transition-colors',
            'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          <option value="">{loading ? 'Cargando…' : placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle"
        />
      </div>
    </label>
  );
}
