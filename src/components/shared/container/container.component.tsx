import type { ReactNode } from 'react';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ className = '', ...props }: IContainerProps) => {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[clamp(1.5rem,4.5vw,5rem)] ${className}`}
    />
  );
};
