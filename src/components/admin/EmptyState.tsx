import * as Icons from "lucide-react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

/**
 * Generic "nothing here yet" placeholder (components/admin), reusable
 * across future admin list pages (announcements, events, etc.) as well
 * as this sprint's Dashboard "Recent Activity" placeholder.
 */
export function EmptyState({ icon = "Inbox", title, description }: EmptyStateProps) {
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  )[icon];

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-foreground/40">
        {IconComponent && <IconComponent className="h-6 w-6" aria-hidden="true" />}
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
      )}
    </div>
  );
}
