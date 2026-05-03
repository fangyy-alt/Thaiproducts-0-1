'use client';

import { useState } from 'react';
import { drawRandomCard } from '@/lib/tarot-deck';
import type { TarotCard } from '@/types/session';
import CardFace from './CardFace';
import { th } from '@/lib/i18n-th';

type Phase = 'deck' | 'flipping' | 'revealed';

interface CardDrawProps {
  onCardDrawn: (card: TarotCard) => void;
}

export default function CardDraw({ onCardDrawn }: CardDrawProps) {
  const [phase, setPhase] = useState<Phase>('deck');
  const [card, setCard] = useState<TarotCard | null>(null);

  function handleDraw() {
    if (phase !== 'deck') return;
    const drawn = drawRandomCard();
    setCard(drawn);
    setPhase('flipping');
    // 1200ms 翻牌动效结束后
    setTimeout(() => {
      setPhase('revealed');
      onCardDrawn(drawn);
    }, 1200);
  }

  if (phase === 'deck') {
    return (
      <button
        type="button"
        className="card-deck"
        onClick={handleDraw}
        aria-label={th.draw.deckHint}
      >
        <span className="card-deck__hint">{th.draw.deckHint}</span>
      </button>
    );
  }

  if (!card) return null;

  return <CardFace card={card} size="large" flipping={phase === 'flipping'} />;
}
