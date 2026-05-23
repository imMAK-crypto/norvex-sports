'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, CheckCircle2 } from 'lucide-react';
import { submitContact } from '@/app/(site)/contact/actions';

const PROGRAMS = [
  'Football Development Program',
  'One-to-One Personal Coaching',
  'Advanced Player Development',
  'Adult Football Training',
  'School & College Coaching',
  'Fitness & Conditioning',
  'Talent Trials',
  'Birthday Party',
  'General Enquiry',
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    const res = await submitContact(formData);
    setPending(false);
    if (res.ok) {
      setDone(true);
      toast.success(res.message);
      (document.getElementById('contact-form') as HTMLFormElement | null)?.reset();
    } else {
      toast.error(res.message);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-400" />
        <h3 className="mt-4 font-display text-2xl">You're in.</h3>
        <p className="mt-2 text-sm text-white/70">
          We'll get back to you on WhatsApp or phone within one working day.
        </p>
        <button type="button" onClick={() => setDone(false)} className="btn-outline mt-6">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form id="contact-form" action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="age">Age</label>
          <input id="age" name="age" className="input" placeholder="e.g. 12" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone *</label>
          <input id="phone" name="phone" required className="input" autoComplete="tel" inputMode="tel" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="program">Program Interested In</label>
        <select id="program" name="program" className="input" defaultValue="">
          <option value="" disabled>Select a program…</option>
          {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} className="input" placeholder="Tell us a bit about the player or what you're looking for…" />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto disabled:opacity-50">
        {pending ? (
          'Sending…'
        ) : (
          <>
            Send Enquiry <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
