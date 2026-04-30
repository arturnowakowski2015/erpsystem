import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType =
  | 'draft'
  | 'confirmed'
  | 'revised'
  | 'archived'
  | 'posted'
  | 'paid'
  | 'partially_paid'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'income'
  | 'expense';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'bg-draft/10 text-draft border border-draft/20' },
  confirmed: { label: 'Confirmed', variant: 'bg-success/10 text-success border border-success/20' },
  revised: { label: 'Revised', variant: 'bg-warning/10 text-warning border border-warning/20' },
  archived: { label: 'Archived', variant: 'bg-muted text-muted-foreground border border-border' },
  posted: { label: 'Posted', variant: 'bg-info/10 text-info border border-info/20' },
  paid: { label: 'Paid', variant: 'bg-success/10 text-success border border-success/20 font-semibold' },
  partially_paid: { label: 'Partially Paid', variant: 'bg-warning/10 text-warning border border-warning/20' },
  pending: { label: 'Pending', variant: 'bg-warning/10 text-warning border border-warning/20' },
  completed: { label: 'Completed', variant: 'bg-success/10 text-success border border-success/20' },
  failed: { label: 'Failed', variant: 'bg-destructive/10 text-destructive border border-destructive/20' },
  cancelled: { label: 'Cancelled', variant: 'bg-destructive/10 text-destructive border border-destructive/20' },
  income: { label: 'Income', variant: 'bg-success/10 text-success border border-success/20' },
  expense: { label: 'Expense', variant: 'bg-warning/10 text-warning border border-warning/20' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'bg-muted text-muted-foreground border border-border' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        config.variant,
        className
      )}
    >
      {config.label}
    </span>
  );
}
