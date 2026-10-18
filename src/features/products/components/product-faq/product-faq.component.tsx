import { ChevronDown } from 'lucide-react';
import type { IProductFaqItem } from '../../products.types';

interface IProductFaqProps {
  items: ReadonlyArray<IProductFaqItem>;
}

export const ProductFaq = ({ items }: IProductFaqProps) => (
  <div className="divide-y divide-border border-b border-border">
    {items.map(({ question, answer }) => (
      <details key={question} className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-text-primary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-details-marker]:hidden">
          {question}
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <p className="pb-5 text-sm leading-relaxed text-text-secondary">{answer}</p>
      </details>
    ))}
  </div>
);
