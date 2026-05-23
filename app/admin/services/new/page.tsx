import { AdminFormShell } from '../../_components/AdminListShell';
import { ServiceForm } from '../ServiceForm';
import { createService } from '../actions';

export default function NewServicePage() {
  return (
    <AdminFormShell title="New service">
      <ServiceForm action={createService} />
    </AdminFormShell>
  );
}
