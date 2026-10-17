import Script from 'next/script';

interface IThemeBootstrapViewProps {
  script: string;
  isHydrated: boolean;
}

export const ThemeBootstrapView = ({ script, isHydrated }: IThemeBootstrapViewProps) =>
  isHydrated ? null : (
    <Script
      id="theme-bootstrap"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
