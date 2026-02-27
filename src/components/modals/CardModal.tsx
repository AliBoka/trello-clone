'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { CommentSection } from './CommentSection';

export const CardModal = () => {
  const { board, activeListId, activeCardId, setActiveCard, updateCardTitle } =
    useBoardStore();

  // Find the currently active list and card
  const list = board.lists.find((l) => l.id === activeListId);
  const card = list?.cards.find((c) => c.id === activeCardId);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCard(null, null);
    };
    if (card) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, setActiveCard]);

  // Don't render anything if no card is active
  if (!card || !list) return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveCard(null, null)}>
      <div className="card-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-wrapper">
            <InlineEdit
              value={card.title}
              onSave={(title) => updateCardTitle(list.id, card.id, title)}
              className="modal-card-title"
            />
            <div className="modal-list-name">
              in list <u>{list.title}</u>
            </div>
          </div>
          <button className="modal-close" onClick={() => setActiveCard(null, null)}>
            <X size={20} />
          </button>
        </header>

        <div className="modal-body">
          <CommentSection listId={list.id} cardId={card.id} comments={card.comments} />
        </div>
      </div>
    </div>
  );
};
