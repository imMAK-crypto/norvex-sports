'use client';

import { useState } from 'react';
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
  const [state, setState] = useState<{ ok?: boolean; msg?: string; pending?: boolean }>({});

  async function action(formData: FormData) {
    setState({ pending: true });
    const res = await submitContact(formData);
    setState({ ok: res.ok, msg: res.message });
    if (res.ok) {
      (document.getElementById('contact-form') as HTMLFormElement | null)?.reset();
    }
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
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" disabled={state.pending} className="btn-primary w-full sm:w-auto disabled:opacity-50">
        {state.pending ? 'Sending…' : 'Send Enquiry'}
      </button>
      {state.msg && (
        <p className={`text-sm ${state.ok ? 'text-brand-400' : 'text-red-400'}`}>{state.msg}</p>
      )}
    </form>
  );
}
