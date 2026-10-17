import type { ComponentPropsWithoutRef } from 'react';
import styles from './home-scene.module.css';

interface IHomeSceneProps extends ComponentPropsWithoutRef<'section'> {
  scene: 'hero' | 'solutions' | 'laboratory';
}

export const HomeScene = ({ scene, children, className = '', ...props }: IHomeSceneProps) => {
  return (
    <section {...props} className={`${styles.scene} ${styles[scene]} ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className={styles.edge}
      >
        <path
          d="M0 0 Q500 200 1000 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
};
