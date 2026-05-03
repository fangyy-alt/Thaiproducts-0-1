import Link from 'next/link';
import { th } from '@/lib/i18n-th';

export default function HomePage() {
  return (
    <section className="invite-cta animate-fade-in-up">
      <p className="invite-cta__text" style={{ whiteSpace: 'pre-line' }}>
        {th.home.invite}
      </p>
      <Link href="/draw" className="btn-primary" prefetch>
        {th.home.cta}
      </Link>
    </section>
  );
}
