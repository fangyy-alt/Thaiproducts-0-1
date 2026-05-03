'use client';

import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import { th } from '@/lib/i18n-th';

export default function FarewellMessage() {
  const router = useRouter();
  const reset = useSessionStore((s) => s.reset);

  function handleRestart() {
    reset();
    router.push('/draw');
  }

  return (
    <section className="farewell animate-fade-in-up">
      <p className="farewell__text" style={{ whiteSpace: 'pre-line' }}>
        {th.done.farewell}
      </p>
      <button type="button" className="btn-primary" onClick={handleRestart}>
        {th.done.restart}
      </button>
    </section>
  );
}
