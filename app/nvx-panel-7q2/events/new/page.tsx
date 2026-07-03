import { AdminFormShell } from '../../_components/AdminListShell';
import { EventForm } from '../EventForm';
import { createEvent } from '../actions';

export default function NewEventPage() {
  return (
    <AdminFormShell title="New event">
      <EventForm action={createEvent} />
    </AdminFormShell>
  );
}
