import type { LucideIcon } from 'lucide-react';

export interface ISolutionCard {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isAvailable: boolean;
}
