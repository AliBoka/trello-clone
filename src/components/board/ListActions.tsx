'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, X, ChevronLeft } from 'lucide-react';
import { useBoardStore } from '@/libs/store/useBoardStore';

interface ListActionsProps {
  listId: string;
}

export const ListActions = ({ listId }: ListActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'main' | 'delete'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  const deleteList = useBoardStore((state) => state.deleteList);
  const deleteAllCards = useBoardStore((state) => state.deleteAllCards);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setStep('main'); // Reset step on close
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDeleteList = () => {
    deleteList(listId);
  };

  return (
    <div className="list-actions-wrapper" ref={menuRef}>
      <button className="list-actions-trigger" onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div className="list-actions-popover">
          <header className="popover-header">
            {step === 'delete' && (
              <button className="popover-back" onClick={() => setStep('main')}>
                <ChevronLeft size={20} />
              </button>
            )}
            <span className="popover-title">
              {step === 'main' ? 'List Actions' : 'Delete List?'}
            </span>
            <button className="popover-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </header>

          <div className="popover-content">
            {step === 'main' ? (
              <>
                <button className="popover-item" onClick={() => setStep('delete')}>
                  Delete List
                </button>
                <button
                  className="popover-item"
                  onClick={() => {
                    deleteAllCards(listId);
                    setIsOpen(false);
                  }}
                >
                  Delete All Cards
                </button>
              </>
            ) : (
              <div className="popover-confirm">
                <p>
                  All actions will be removed from the activity feed and you won&apos;t be
                  able to re-open the list. There is no undo.
                </p>
                <button className="btn-danger" onClick={handleDeleteList}>
                  Delete list
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
