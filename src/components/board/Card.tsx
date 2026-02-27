'use client';

import { Card as CardType } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';

interface CardProps {
  card: CardType;
  listId: string;
}

export const Card = ({ card, listId }: CardProps) => {
  const setActiveCard = useBoardStore((state) => state.setActiveCard);

  return (
    <div className="card-container" onClick={() => setActiveCard(listId, card.id)}>
      <div className="card-title">{card.title}</div>

      {card.comments && card.comments.length > 0 && (
        <div className="card-badges">
          <span className="badge">Comments ({card.comments.length})</span>
        </div>
      )}
    </div>
  );
};
