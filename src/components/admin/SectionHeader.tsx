interface SectionHeaderProps {
  title: string;
  description?: string;
}

/**
 * Heading for a single section within an admin page (e.g. "Quick
 * Actions", "Recent Activity") — distinct from AdminHeader, which is the
 * page-level title/breadcrumb block.
 */
export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
      )}
    </div>
  );
}
