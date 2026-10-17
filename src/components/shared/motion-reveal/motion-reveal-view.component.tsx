import type { ReactNode, RefObject } from 'react';

interface IMotionRevealViewProps {
  children: ReactNode;
  className: string;
  elementRef: RefObject<HTMLDivElement | null>;
}

export const MotionRevealView = ({ children, className, elementRef }: IMotionRevealViewProps) => (
  <div ref={elementRef} data-motion-reveal className={className}>
    {children}
  </div>
);
