interface ISocialLink {
  id: 'youtube' | 'instagram';
  label: string;
  href?: string;
}

export const SOCIAL_LINKS: Array<ISocialLink> = [
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/devcosmolab/' },
];
