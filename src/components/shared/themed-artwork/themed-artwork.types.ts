import type { CSSProperties } from 'react';

export interface IArtworkStyle extends CSSProperties {
  '--artwork-dark': string;
  '--artwork-light': string;
  '--artwork-mobile-dark'?: string;
  '--artwork-mobile-light'?: string;
}
