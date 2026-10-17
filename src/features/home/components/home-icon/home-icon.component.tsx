const iconPaths = {
  code: 'm9 7-5 5 5 5m6-10 5 5-5 5m-3-12-2 14',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2 4-4 2 2-4 4-2Z',
  growth: 'M5 19V9m7 10V5m7 14v-7M3 19h18',
  grid: 'M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z',
  spark:
    'M12 3v6m0 6v6M3 12h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4 4.2 4.2m0-12.8-4.2 4.2m-4.4 4.4-4.2 4.2',
};

export type HomeIconName = keyof typeof iconPaths;

interface IHomeIconProps {
  name: HomeIconName;
  className: string;
}

export const HomeIcon = ({ name, className }: IHomeIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={iconPaths[name]} />
  </svg>
);
