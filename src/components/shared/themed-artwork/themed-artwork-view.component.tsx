import type { IArtworkStyle } from './themed-artwork.types';
import styles from './themed-artwork-view.module.css';

interface IThemedArtworkViewProps {
  artworkStyle: IArtworkStyle;
  alt?: string;
  className: string;
  hasMobileArtwork: boolean;
}

export const ThemedArtworkView = ({
  artworkStyle,
  alt,
  className,
  hasMobileArtwork,
}: IThemedArtworkViewProps) => (
  <div
    role={alt ? 'img' : undefined}
    aria-label={alt}
    aria-hidden={alt ? undefined : true}
    style={artworkStyle}
    className={`themed-artwork bg-no-repeat theme-ready:[background-image:var(--artwork-dark)] theme-ready:light:[background-image:var(--artwork-light)] ${hasMobileArtwork ? styles.responsive : ''} ${className}`}
  />
);
