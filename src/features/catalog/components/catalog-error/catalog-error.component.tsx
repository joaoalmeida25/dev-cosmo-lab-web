'use client';

import { useTranslations } from 'next-intl';
import { CatalogErrorView } from './catalog-error-view.component';

interface ICatalogErrorProps {
  onRetry: () => void;
}
export const CatalogError = ({ onRetry }: ICatalogErrorProps) => {
  const t = useTranslations('common.catalogError');
  return (
    <CatalogErrorView
      title={t('title')}
      description={t('description')}
      retry={t('retry')}
      onRetry={onRetry}
    />
  );
};
