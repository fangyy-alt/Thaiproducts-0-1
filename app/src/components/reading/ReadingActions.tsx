'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import { th } from '@/lib/i18n-th';

export default function ReadingActions() {
  const router = useRouter();
  const reset = useSessionStore((s) => s.reset);

  function handleDrawAgain() {
    reset();
    router.push('/draw');
  }

  return (
    <div
      className="actions-row"
      style={{ width: '100%', maxWidth: 'var(--container-max)', marginInline: 'auto' }}
    >
      <button type="button" className="btn-ghost" onClick={handleDrawAgain}>
        {th.reading.drawAgain}
      </button>
      <Link href="/done" className="btn-primary" prefetch>
        {th.reading.done}
      </Link>
    </div>
  );
}
