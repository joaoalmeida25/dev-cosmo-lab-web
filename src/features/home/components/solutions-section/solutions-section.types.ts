import type { HomeIconName } from '../home-icon/home-icon.component';

export interface ISolutionCard {
  id: string;
  icon: HomeIconName;
  title: string;
  description: string;
  isAvailable: boolean;
}
