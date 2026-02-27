'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/libs/utils/cn';

interface AddActionProps {
  onAdd: (text: string) => void;
  buttonText: string;
  placeholder: string;
  isBoardLevel?: boolean;
}

export const AddAction = ({
  onAdd,
  buttonText,
  placeholder,
  isBoardLevel = false,
}: AddActionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText('');
    }
  };

  if (isEditing) {
    return (
      <div className={cn('add-action-form', isBoardLevel && 'board-level')}>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="add-action-input"
        />
        <div className="add-action-controls">
          <button onClick={handleAdd} className="add-action-submit">
            Add {buttonText.split(' ')[1]}
          </button>
          <button onClick={() => setIsEditing(false)} className="add-action-cancel">
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className={cn('add-action-button', {
        'board-level': isBoardLevel,
      })}
      onClick={() => setIsEditing(true)}
    >
      + {buttonText}
    </button>
  );
};
