'use client';

import { useState } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import StreamingReading from '@/components/reading/StreamingReading';
import ReadingActions from '@/components/reading/ReadingActions';
import DonateBlock from '@/components/reading/DonateBlock';
import CardFace from '@/components/tarot/CardFace';
import { th } from '@/lib/i18n-th';

export default function ReadingPage({ params }: { params: { sessionId: string } }) {
  const card = useSessionStore((s) => s.card);
  const [readingComplete, setReadingComplete] = useState(false);

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            alignSelf: 'flex-start',
            paddingInline: 'var(--container-padding-mobile)',
          }}
        >
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

      <StreamingReading
        sessionId={params.sessionId}
        onComplete={() => setReadingComplete(true)}
      />

      {readingComplete && (
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--container-max)',
            paddingInline: 'var(--container-padding-mobile)',
          }}
        >
          <DonateBlock sessionId={params.sessionId} />
          <ReadingActions />
        </div>
      )}
    </section>
  );
}
