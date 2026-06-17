'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { clientKey, rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name').max(120),
  age: z.string().regex(/^\d{1,3}$/, 'Age must be up to 3 digits').optional().or(z.literal('')),
  phone: z.string().min(6, 'Please enter a valid phone').max(40),
  email: z.string().email().max(160).optional().or(z.literal('')),
  program: z.string().max(160).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
});

export async function submitContact(formData: FormData) {
  const rl = rateLimit(clientKey({ headers: headers() }, 'contact'), { max: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return { ok: false as const, message: `Too many requests — try again in ${rl.retryAfterSec}s.` };
  }
  const data = {
    name: String(formData.get('name') ?? ''),
    age: String(formData.get('age') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    program: String(formData.get('program') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? ''),
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input';
    return { ok: false as const, message: first };
  }
  if (parsed.data.website) {
    // honeypot triggered — pretend success
    return { ok: true as const, message: 'Thanks — we\'ll be in touch.' };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name.trim(),
        age: parsed.data.age || null,
        phone: parsed.data.phone.trim(),
        email: parsed.data.email || null,
        program: parsed.data.program || null,
        message: parsed.data.message || null,
      },
    });
    return { ok: true as const, message: 'Thanks — we\'ll be in touch shortly.' };
  } catch (err) {
    console.error('contact submission failed', err);
    return { ok: false as const, message: 'Could not send right now — please WhatsApp us instead.' };
  }
}
