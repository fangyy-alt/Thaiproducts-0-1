'use client';

import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { th } from '@/lib/i18n-th';

const FONT_SCALE_KEY = 'hug_font_scale';
const SCALES: Array<'1' | '1.15' | '1.3'> = ['1', '1.15', '1.3'];

export default function AppHeader() {
  const [scale, setScale] = useState<'1' | '1.15' | '1.3'>('1');
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FONT_SCALE_KEY) as '1' | '1.15' | '1.3' | null;
    if (stored && SCALES.includes(stored)) {
      setScale(stored);
      document.documentElement.dataset.fontScale = stored;
    }
  }, []);

  function cycleScale() {
    const idx = SCALES.indexOf(scale);
    const next = SCALES[(idx + 1) % SCALES.length];
    setScale(next);
    document.documentElement.dataset.fontScale = next;
    localStorage.setItem(FONT_SCALE_KEY, next);
  }

  const scaleLabel = scale === '1' ? th.fontScale.a : scale === '1.15' ? th.fontScale.aPlus : th.fontScale.aPlusPlus;

  return (
    <>
      <header className="app-header">
        <button
          type="button"
          className="privacy-badge"
          onClick={() => setShowPrivacy(true)}
          aria-label={th.privacy.dialogTitle}
        >
          <Shield size={14} aria-hidden="true" />
          <span>{th.privacy.badge}</span>
        </button>
        <button
          type="button"
          className="btn-tertiary"
          onClick={cycleScale}
          aria-label={th.fontScale.label}
          style={{ minWidth: 44 }}
        >
          {scaleLabel}
        </button>
      </header>

      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          onClick={() => setShowPrivacy(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 20, 36, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 'var(--z-modal)' as unknown as number,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              maxWidth: 400,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h2
              id="privacy-title"
              style={{
                fontSize: 'var(--font-size-h3)',
                fontWeight: 600,
                color: 'var(--color-text-strong)',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              {th.privacy.dialogTitle}
            </h2>
            <p
              style={{
                color: 'var(--color-text)',
                margin: '0 0 var(--space-6) 0',
                whiteSpace: 'pre-line',
                lineHeight: 'var(--line-height-loose)',
              }}
            >
              {th.privacy.dialogBody}
            </p>
            <button type="button" className="btn-ghost" onClick={() => setShowPrivacy(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
