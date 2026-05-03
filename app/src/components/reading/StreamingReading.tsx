'use client';

import { useEffect, useState } from 'react';
import { th } from '@/lib/i18n-th';

interface StreamingReadingProps {
  sessionId: string;
  onComplete?: (fullText: string) => void;
  onError?: (err: Error) => void;
}

type Phase = 'idle' | 'streaming' | 'complete' | 'error';

export default function StreamingReading({
  sessionId,
  onComplete,
  onError,
}: StreamingReadingProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    setText('');
    setPhase('streaming');

    (async () => {
      try {
        const res = await fetch('/api/reading', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          signal: ac.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let acc = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (cancelled) {
            await reader.cancel();
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          acc += chunk;
          if (!cancelled) setText(acc);
        }

        if (!cancelled) {
          setPhase('complete');
          onComplete?.(acc);
        }
      } catch (err) {
        if (cancelled) return;
        if ((err as Error).name === 'AbortError') return;
        setPhase('error');
        onError?.(err as Error);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (phase === 'idle' || (phase === 'streaming' && text.length === 0)) {
    return (
      <div className="streaming-reading">
        <p className="streaming-reading__waiting">{th.reading.waiting}</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="streaming-reading" role="alert">
        <p style={{ color: 'var(--color-danger)' }}>{th.error.aiUnavailable}</p>
      </div>
    );
  }

  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="streaming-reading" aria-live="polite">
      {paragraphs.map((p, idx) => {
        const isLast = idx === paragraphs.length - 1;
        return (
          <p key={idx}>
            {p}
            {isLast && phase === 'streaming' && (
              <span className="streaming-reading__cursor" aria-hidden="true" />
            )}
          </p>
        );
      })}
    </article>
  );
}
