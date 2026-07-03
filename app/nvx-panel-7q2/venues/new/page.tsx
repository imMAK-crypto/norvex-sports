import { AdminFormShell } from '../../_components/AdminListShell';
import { VenueForm } from '../VenueForm';
import { createVenue } from '../actions';

export default function NewVenuePage() {
  return (
    <AdminFormShell title="Add venue">
      <VenueForm action={createVenue} />
    </AdminFormShell>
  );
}
