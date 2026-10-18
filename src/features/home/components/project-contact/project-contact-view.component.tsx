import { Button } from '@/components/ui/button/button.component';
interface IProjectContactViewProps {
  href: string | null;
  label: string;
  pending: string;
}
export const ProjectContactView = ({ href, label, pending }: IProjectContactViewProps) => (
  <div className="flex max-w-sm flex-col gap-2">
    {href ? (
      <Button href={href} size="lg" variant="secondary">
        {label}
      </Button>
    ) : (
      <>
        <span
          aria-disabled="true"
          className="inline-flex min-h-12 items-center justify-center rounded-control border border-border bg-surface/40 px-5 py-3 text-sm font-medium text-text-secondary opacity-70"
        >
          {label}
        </span>
        <p className="text-xs leading-relaxed text-text-secondary">{pending}</p>
      </>
    )}
  </div>
);
