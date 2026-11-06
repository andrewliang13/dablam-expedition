'use client';
import { useState } from 'react';
import { EMAIL } from '@/lib/content';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function InquiryForm({ defaultDestination = '' }: { defaultDestination?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const phone = String(f.get('phone') || '').trim();
    const dest = String(f.get('destination') || '').trim();
    const message = String(f.get('message') || '').trim();
    const next: Errors = {};
    if (!name) next.name = 'Add your name so I know who I’m writing back to.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter an email like you@example.com.';
    if (message.length < 10) next.message = 'Tell me a little about the trip: who, when, what kind of journey.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : '', dest ? `Destination: ${dest}` : '']
      .filter(Boolean)
      .concat(['', message])
      .join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Trip inquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
          {errors.name && <em id="err-name">{errors.name}</em>}
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
          {errors.email && <em id="err-email">{errors.email}</em>}
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>
            Phone <small>optional</small>
          </span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="field">
          <span>Destination</span>
          <select name="destination" defaultValue={defaultDestination}>
            <option value="">Not sure yet</option>
            <option value="Nepal">Nepal</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Nepal + Bhutan">Nepal + Bhutan</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Your journey</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Who's coming, roughly when, and what you'd love to see or climb."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
        />
        {errors.message && <em id="err-message">{errors.message}</em>}
      </label>
      <div className="form__foot">
        <button type="submit" className="btn btn--light">
          Send inquiry
        </button>
        <p className="form__note" role="status">
          {sent ? `Your email app should open with the inquiry ready. If it didn't, write to ${EMAIL}.` : `Opens your email app, addressed to ${EMAIL}.`}
        </p>
      </div>
    </form>
  );
}
