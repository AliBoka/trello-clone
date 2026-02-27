'use client';

import { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Pencil } from 'lucide-react';
import { Card as CardType } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { cn } from '@/libs/utils/cn';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
}

export const Card = ({ card, listId, index }: CardProps) => {
  const { setActiveCard, updateCardTitle } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Auto-focus and select text when entering edit mode
  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== card.title) {
      updateCardTitle(listId, card.id, editTitle.trim());
    } else {
      setEditTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(card.title);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <div
          className={cn('card-container', { 'is-dragging': snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !isEditing && setActiveCard(listId, card.id)}
        >
          {isEditing ? (
            <div className="card-inline-edit" onClick={(e) => e.stopPropagation()}>
              <textarea
                ref={textareaRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                rows={3}
              />
              <button
                className="btn-save"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div className="card-title">{card.title}</div>

              <button
                className="card-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil size={14} />
              </button>

              {card.comments && card.comments.length > 0 && (
                <div className="card-badges">
                  <span className="badge">Comments ({card.comments.length})</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};
