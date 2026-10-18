import { Button } from '@/components/ui/button/button.component';
import { Container } from '@/components/shared/container/container.component';

interface ICatalogErrorViewProps {
  title: string;
  description: string;
  retry: string;
  onRetry: () => void;
}

export const CatalogErrorView = ({
  title,
  description,
  retry,
  onRetry,
}: ICatalogErrorViewProps) => (
  <Container className="py-36 text-center">
    <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
    <p className="mt-4 mb-6 text-text-secondary">{description}</p>
    <Button onClick={onRetry} variant="primary">
      {retry}
    </Button>
  </Container>
);
