'use client';

import { CatalogError } from '@/features/catalog/components/catalog-error/catalog-error.component';

const CatalogErrorPage = ({ retry }: { retry: () => void }) => <CatalogError onRetry={retry} />;

export default CatalogErrorPage;
