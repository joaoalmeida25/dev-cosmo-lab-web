import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';

interface IThemeToggleViewProps {
  label: string;
  disabled: boolean;
  showSun: boolean;
  onToggle: () => void;
}

export const ThemeToggleView = ({ label, disabled, showSun, onToggle }: IThemeToggleViewProps) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onToggle}
      disabled={disabled}
      aria-label={label}
      className="text-accent [&_[data-button-icon]]:size-[18px]"
    >
      {showSun ? (
        <Sun aria-hidden="true" strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" strokeWidth={1.75} />
      )}
    </Button>
  );
};
