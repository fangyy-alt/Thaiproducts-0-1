'use client';

import { useEffect, useRef, useState } from 'react';
import { th } from '@/lib/i18n-th';

interface DonateBlockProps {
  sessionId: string;
  amounts?: number[];
  onDonationComplete?: (amount: number) => void;
}

type Phase = 'idle' | 'creating' | 'awaiting_payment' | 'success' | 'failed' | 'expired';

export default function DonateBlock({
  sessionId,
  amounts = [20, 35, 50],
  onDonationComplete,
}: DonateBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [piId, setPiId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    pollRef.current = null;
    tickRef.current = null;
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  async function handleSelect(amount: number) {
    if (phase === 'creating' || phase === 'awaiting_payment') return;
    setSelected(amount);
    setPhase('creating');
    setError(null);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, amountThb: amount }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPiId(data.paymentIntentId);
      setSecondsLeft(data.expiresInSeconds);
      setPhase('awaiting_payment');

      // 倒计时
      tickRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setPhase('expired');
            clearTimers();
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      // 轮询状态（每 2 秒）
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`/api/donate/${data.paymentIntentId}`, {
            cache: 'no-store',
          });
          if (!r.ok) return;
          const j = await r.json();
          if (j.status === 'succeeded') {
            clearTimers();
            setPhase('success');
            onDonationComplete?.(amount);
          } else if (j.status === 'failed') {
            clearTimers();
            setPhase('failed');
          } else if (j.status === 'expired') {
            clearTimers();
            setPhase('expired');
          }
        } catch {
          // 静默；下次轮询继续
        }
      }, 2000);
    } catch (e) {
      setPhase('failed');
      setError(th.error.network);
    }
  }

  function handleReset() {
    clearTimers();
    setSelected(null);
    setPiId(null);
    setSecondsLeft(0);
    setError(null);
    setPhase('idle');
  }

  if (phase === 'success') {
    return (
      <section className="donate-block animate-fade-in-up" aria-live="polite">
        <p
          className="donate-block__title"
          style={{
            color: 'var(--color-success)',
            fontSize: 'var(--font-size-body)',
          }}
        >
          {th.donate.thanks}
        </p>
      </section>
    );
  }

  return (
    <section className="donate-block">
      <p className="donate-block__title" style={{ whiteSpace: 'pre-line' }}>
        {th.donate.title}
      </p>
      <div className="donate-amounts" role="group">
        {amounts.map((amount) => {
          const isPressed = selected === amount && phase !== 'idle';
          return (
            <button
              key={amount}
              type="button"
              className="donate-amount"
              aria-pressed={isPressed}
              disabled={phase === 'creating' || (phase === 'awaiting_payment' && selected !== amount)}
              onClick={() => handleSelect(amount)}
            >
              {amount} ฿
            </button>
          );
        })}
      </div>

      {phase === 'awaiting_payment' && piId && selected && (
        <div className="promptpay-qr" role="status" aria-live="polite">
          <div className="promptpay-qr__svg" aria-label="QR code (mock)">
            QR
          </div>
          <div className="promptpay-qr__amount">
            {th.donate.qrAmount(selected)}
          </div>
          <div className="promptpay-qr__countdown">
            {th.donate.qrCountdown(secondsLeft)}
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-caption)',
              color: '#6e6a85',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {th.donate.qrTitle}
          </p>
        </div>
      )}

      {(phase === 'failed' || phase === 'expired') && (
        <div
          role="alert"
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-small)',
            textAlign: 'center',
          }}
        >
          {error ?? th.donate.failed}
          <button
            type="button"
            className="btn-tertiary"
            onClick={handleReset}
            style={{ display: 'block', margin: 'var(--space-2) auto 0' }}
          >
            {th.error.tryAgain}
          </button>
        </div>
      )}
    </section>
  );
}
