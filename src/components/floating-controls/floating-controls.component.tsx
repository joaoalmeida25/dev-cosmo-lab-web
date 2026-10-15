import { LanguageToggle } from '@/components/language-toggle/language-toggle.component';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle.component';

export const FloatingControls = () => {
  return (
    <div className="fixed top-[calc(1rem+env(safe-area-inset-top,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-50 flex items-start gap-2 sm:top-[calc(1.5rem_+_env(safe-area-inset-top,0px))] sm:right-[calc(1.5rem_+_env(safe-area-inset-right,0px))]">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  );
};
