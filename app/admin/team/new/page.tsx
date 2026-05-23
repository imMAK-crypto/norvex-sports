import { AdminFormShell } from '../../_components/AdminListShell';
import { TeamForm } from '../TeamForm';
import { createTeam } from '../actions';

export default function NewTeamPage() {
  return (
    <AdminFormShell title="Add team member">
      <TeamForm action={createTeam} />
    </AdminFormShell>
  );
}
