'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card as CardType } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { cn } from '@/libs/utils/cn';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
}

export const Card = ({ card, listId, index }: CardProps) => {
  const setActiveCard = useBoardStore((state) => state.setActiveCard);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn('card-container', { 'is-dragging': snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setActiveCard(listId, card.id)}
        >
          <div className="card-title">{card.title}</div>

          {card.comments && card.comments.length > 0 && (
            <div className="card-badges">
              <span className="badge">Comments ({card.comments.length})</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
