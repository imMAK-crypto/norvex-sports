import { AdminFormShell } from '../../_components/AdminListShell';
import { NewsForm } from '../NewsForm';
import { createNews } from '../actions';

export default function NewNewsPage() {
  return (
    <AdminFormShell title="New post">
      <NewsForm action={createNews} />
    </AdminFormShell>
  );
}
