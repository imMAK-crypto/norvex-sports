import { prisma, safeQuery } from '@/lib/prisma';
import { EnquiriesClient, type Enquiry } from './EnquiriesClient';

export const dynamic = 'force-dynamic';

export default async function ContactsAdminPage() {
  const items = await safeQuery(
    () => prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 300 }),
    [],
  );

  const initial: Enquiry[] = items.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    phone: c.phone,
    email: c.email,
    program: c.program,
    message: c.message,
    isRead: c.isRead,
    label: c.label ?? 'new',
    note: c.note,
    createdAt: c.createdAt.toISOString(),
  }));

  return <EnquiriesClient initial={initial} />;
}
