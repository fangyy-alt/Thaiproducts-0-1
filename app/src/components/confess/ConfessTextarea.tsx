'use client';

import { th } from '@/lib/i18n-th';

interface ConfessTextareaProps {
  value: string;
  onChange: (v: string) => void;
  minChars?: number;
  maxChars?: number;
  disabled?: boolean;
}

export default function ConfessTextarea({
  value,
  onChange,
  minChars = 50,
  maxChars = 1000,
  disabled = false,
}: ConfessTextareaProps) {
  const current = value.length;
  const tooShort = current < minChars;
  const nearMax = current > maxChars * 0.9;

  return (
    <div style={{ width: '100%', maxWidth: 'var(--container-max)' }}>
      <textarea
        className="confess-textarea"
        value={value}
        onChange={(e) => {
          // 硬约束：超过上限阻止继续输入
          if (e.target.value.length <= maxChars) {
            onChange(e.target.value);
          }
        }}
        placeholder={th.confess.placeholder}
        disabled={disabled}
        aria-label={th.confess.title}
      />
      <div
        className={`confess-meta ${nearMax ? 'confess-meta--warn' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span>
          {tooShort
            ? th.confess.minHint(current, minChars)
            : th.confess.maxHint(current, maxChars)}
        </span>
      </div>
    </div>
  );
}
