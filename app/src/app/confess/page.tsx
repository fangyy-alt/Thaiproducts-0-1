'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import ConfessTextarea from '@/components/confess/ConfessTextarea';
import CrisisGate from '@/components/confess/CrisisGate';
import CardFace from '@/components/tarot/CardFace';
import { th } from '@/lib/i18n-th';

const MIN_CHARS = 50;
const MAX_CHARS = 1000;

export default function ConfessPage() {
  const router = useRouter();
  const card = useSessionStore((s) => s.card);
  const confessDraft = useSessionStore((s) => s.confessDraft);
  const setConfessDraft = useSessionStore((s) => s.setConfessDraft);
  const setSessionId = useSessionStore((s) => s.setSessionId);
  const setReadingPhase = useSessionStore((s) => s.setReadingPhase);

  const [submitting, setSubmitting] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 已 hydrate 但没抽过牌 → 跳回 /draw
  useEffect(() => {
    if (mounted && !card && !crisis) {
      router.replace('/draw');
    }
  }, [mounted, card, crisis, router]);

  if (crisis) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
        <CrisisGate />
      </div>
    );
  }

  const canSubmit = confessDraft.trim().length >= MIN_CHARS && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !card) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          confessText: confessDraft.trim(),
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();

      if (data.type === 'crisis') {
        setReadingPhase('crisis');
        setCrisis(true);
        return;
      }

      if (data.type === 'session_ready' && data.sessionId) {
        setSessionId(data.sessionId);
        // 成功后清空草稿
        setConfessDraft('');
        router.push(`/reading/${data.sessionId}`);
        return;
      }

      throw new Error('unexpected_response');
    } catch (e) {
      setError(th.error.network);
      setSubmitting(false);
    }
  }

  return (
    <section
      className="container animate-fade-in-up"
      style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-6)',
      }}
    >
      {card && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <CardFace card={card} size="mini" />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-small)',
                color: 'var(--color-text-muted)',
              }}
            >
              {th.reading.cardSubtitle}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-h3)',
                color: 'var(--color-accent)',
              }}
            >
              {card.nameTh}
            </p>
          </div>
        </div>
      )}

      <div style={{ width: '100%', textAlign: 'center', marginTop: 'var(--space-4)' }}>
        <h2
          style={{
            fontSize: 'var(--font-size-h2)',
            fontWeight: 500,
            color: 'var(--color-text-strong)',
            margin: 0,
          }}
        >
          {th.confess.title}
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--color-text-muted)',
            margin: 'var(--space-2) 0 0 0',
          }}
        >
          {th.confess.subtitle}
        </p>
      </div>

      <ConfessTextarea
        value={confessDraft}
        onChange={setConfessDraft}
        minChars={MIN_CHARS}
        maxChars={MAX_CHARS}
        disabled={submitting}
      />

      {error && (
        <div
          role="alert"
          style={{
            color: 'var(--color-danger)',
            fontSize: 'var(--font-size-small)',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={!canSubmit}
        onClick={handleSubmit}
        style={{ minWidth: 200 }}
      >
        {submitting ? th.confess.submitting : th.confess.submit}
      </button>
    </section>
  );
}
