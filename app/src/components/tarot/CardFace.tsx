import type { TarotCard } from '@/types/session';

interface CardFaceProps {
  card: TarotCard;
  size?: 'large' | 'mini';
  flipping?: boolean;
}

export default function CardFace({ card, size = 'large', flipping = false }: CardFaceProps) {
  const cls = [
    'card-face',
    size === 'mini' && 'card-face--mini',
    flipping && 'card-face--flipping',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} aria-label={card.nameTh}>
      <div className="card-face__symbol" aria-hidden="true">
        {card.symbol}
      </div>
      <h3 className="card-face__name">{card.nameTh}</h3>
      {size === 'large' && (
        <p className="card-face__keyword">{card.keywordsTh.join(' · ')}</p>
      )}
    </div>
  );
}
