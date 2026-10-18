import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';

interface IProfessionalCredibilityViewProps {
  eyebrow: string;
  title: string;
  description: string;
  experience: string;
  expertise: string;
  action: string;
}

export const ProfessionalCredibilityView = ({
  eyebrow,
  title,
  description,
  experience,
  expertise,
  action,
}: IProfessionalCredibilityViewProps) => (
  <div className="mt-7 grid gap-5 rounded-card border border-border bg-surface/40 p-5 shadow-card md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center md:gap-8 md:p-6">
    <div>
      <p className="text-[10px] leading-relaxed font-semibold tracking-[0.17em] text-text-accent-context uppercase md:text-[11px]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg leading-snug font-semibold text-text-primary md:text-xl">
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
    <div className="border-t border-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
        <li>{experience}</li>
        <li>{expertise}</li>
      </ul>
      <Button
        href="https://joaoalmeidaa.dev/"
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        rightIcon={<ArrowUpRight />}
        className="mt-4"
      >
        {action}
      </Button>
    </div>
  </div>
);
