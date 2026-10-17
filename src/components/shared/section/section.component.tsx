import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ISectionProps extends ComponentPropsWithoutRef<'section'> {
  children: ReactNode;
}

export const Section = ({ className = '', ...props }: ISectionProps) => {
  return <section {...props} className={`scroll-mt-20 py-section lg:py-section-lg ${className}`} />;
};
