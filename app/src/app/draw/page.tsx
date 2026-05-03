'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardDraw from '@/components/tarot/CardDraw';
import { useSessionStore } from '@/stores/sessionStore';
import type { TarotCard } from '@/types/session';
import { th } from '@/lib/i18n-th';

export default function DrawPage() {
  const router = useRouter();
  const setCard = useSessionStore((s) => s.setCard);
  const reset = useSessionStore((s) => s.reset);
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);

  function handleDrawn(card: TarotCard) {
    setCard(card);
    setDrawnCard(card);
  }

  function handleContinue() {
    router.push('/confess');
  }

  function handleRedraw() {
    reset();
    // 重置组件 key 强制重渲染抽牌交互
    setDrawnCard(null);
    window.location.reload();
  }

  return (
    <section
      className="container animate-fade-in-up"
      style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-8)',
      }}
    >
      <CardDraw onCardDrawn={handleDrawn} />

      {drawnCard && (
        <div
          className="actions-row"
          style={{ width: '100%', maxWidth: 480 }}
        >
          <button type="button" className="btn-ghost" onClick={handleRedraw}>
            {th.draw.drawAgain}
          </button>
          <button type="button" className="btn-primary" onClick={handleContinue}>
            {th.draw.continue}
          </button>
        </div>
      )}
    </section>
  );
}
