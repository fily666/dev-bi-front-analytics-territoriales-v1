import { cn } from '@/shared/ui/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'shimmer rounded-md bg-surface-elevated/60 dark:bg-surface-elevated',
        className,
      )}
      aria-hidden="true"
    />
  );
}
