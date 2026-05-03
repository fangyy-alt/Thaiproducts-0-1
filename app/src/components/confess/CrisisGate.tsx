'use client';

import Link from 'next/link';
import { th } from '@/lib/i18n-th';

export default function CrisisGate() {
  return (
    <section className="crisis-gate animate-fade-in-up" role="alert" aria-live="polite">
      <h2 className="crisis-gate__title">{th.crisis.title}</h2>
      <p className="crisis-gate__message" style={{ whiteSpace: 'pre-line' }}>
        {th.crisis.message}
      </p>
      <a
        href="tel:1323"
        className="crisis-gate__hotline"
        aria-label={th.crisis.hotline}
      >
        {th.crisis.hotline}
      </a>
      <div>
        <Link href="/" className="btn-ghost">
          {th.crisis.backHome}
        </Link>
      </div>
    </section>
  );
}
