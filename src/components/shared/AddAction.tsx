'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/libs/utils/cn';

interface AddActionProps {
  onAdd: (text: string) => void;
  buttonText: string;
  placeholder: string;
  isBoardLevel?: boolean;
  isTextArea?: boolean;
  submitText?: string;
}

export const AddAction = ({
  onAdd,
  buttonText,
  placeholder,
  isBoardLevel = false,
  isTextArea = false,
  submitText,
}: AddActionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  // Separate refs for complete type safety
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      if (isTextArea && textareaRef.current) {
        textareaRef.current.focus();
      } else if (!isTextArea && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, isTextArea]);

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        setText('');
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');

      setTimeout(() => {
        if (isBoardLevel && inputRef.current) {
          inputRef.current.scrollIntoView({
            behavior: 'smooth',
            inline: 'end',
            block: 'end',
          });
        } else if (isTextArea && textareaRef.current) {
          textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  if (isEditing) {
    return (
      <div
        ref={formRef}
        className={cn('add-action-form', { 'board-level': isBoardLevel })}
      >
        {isTextArea ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn('add-action-input', 'is-textarea')}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="add-action-input"
          />
        )}
        <div className="add-action-controls">
          <button onClick={handleAdd} className="add-action-submit">
            {submitText || `Add ${buttonText.split(' ')[1]}`}
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
      className={cn('add-action-button', { 'board-level': isBoardLevel })}
      onClick={() => setIsEditing(true)}
    >
      + {buttonText}
    </button>
  );
};
