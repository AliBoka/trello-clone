'use client';

import { Card as CardType } from '@/types';

interface CardProps {
  card: CardType;
}

export const Card = ({ card }: CardProps) => {
  return (
    <div className="card-container">
      <div className="card-title">{card.title}</div>

      {card.comments && card.comments.length > 0 && (
        <div className="card-badges">
          <span className="badge">Comments ({card.comments.length})</span>
        </div>
      )}
    </div>
  );
};
