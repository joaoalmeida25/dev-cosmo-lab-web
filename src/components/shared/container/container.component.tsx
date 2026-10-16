import type { ReactNode } from 'react';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ className = '', ...props }: IContainerProps) => {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-20 ${className}`}
    />
  );
};
