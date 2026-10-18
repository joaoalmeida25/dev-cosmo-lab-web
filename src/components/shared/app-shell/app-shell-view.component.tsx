import { Fragment, ReactNode } from 'react';
import { Header } from '@/components/shared/header/header.component';
import { Footer } from '@/components/shared/footer/footer.component';

interface IAppShellViewProps {
  children: ReactNode;
  skipToContent: string;
}

export const AppShellView = ({ children, skipToContent }: IAppShellViewProps) => (
  <Fragment>
    <a
      href="#main-content"
      className="sr-only z-50 rounded-control bg-surface px-5 py-3 text-text-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-2 focus:outline-focus-ring"
    >
      {skipToContent}
    </a>
    <Header />
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      {children}
    </main>
    <Footer />
  </Fragment>
);
