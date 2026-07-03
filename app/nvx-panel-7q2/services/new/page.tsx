import { ServiceForm } from '../ServiceForm';
import { createService } from '../actions';

export const dynamic = 'force-dynamic';

export default function NewServicePage() {
  return <ServiceForm action={createService} crumb="SERVICES / NEW" title="New service" />;
}
