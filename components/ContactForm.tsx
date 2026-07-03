'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Send, CheckCircle2 } from 'lucide-react';
import { submitContact } from '@/app/(site)/contact/actions';

const PROGRAMS = [
  'General Enquiry',
  'Football Development Program',
  'One-to-One Personal Coaching',
  'Advanced Player Development',
  'Adult Football Training',
  'School & College Coaching',
  'Fitness & Conditioning',
  'Talent Trials',
  'Birthday Party',
];

// Strip everything except letters/spaces (name) or digits (age, phone) as the
// user types, so the enquiry form only accepts valid characters.
function onlyLetters(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z ]/g, '');
}
function onlyDigits(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
}
// Age: digits only, capped at 3 characters (also enforces pasted values).
function ageDigits(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 3);
}

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
      <div className="rounded-xl border border-brand-600/40 bg-brand-600/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600" />
        <h3 className="mt-4 font-display text-2xl uppercase text-silver-100">You&apos;re in.</h3>
        <p className="mt-2 text-sm text-silver-300">
          We&apos;ll get back to you on WhatsApp or phone within one working day.
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
          <input
            id="name"
            name="name"
            required
            className="input"
            autoComplete="name"
            inputMode="text"
            pattern="[A-Za-z ]+"
            title="Letters only"
            onInput={onlyLetters}
          />
        </div>
        <div>
          <label className="label" htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            className="input"
            placeholder="e.g. 12"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            title="Numbers only (max 3 digits)"
            onInput={ageDigits}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone *</label>
          <input
            id="phone"
            name="phone"
            required
            className="input"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            title="Numbers only"
            onInput={onlyDigits}
          />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="program">Program Interested In</label>
        <select id="program" name="program" className="input" defaultValue="General Enquiry">
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
