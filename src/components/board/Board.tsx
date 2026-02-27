'use client';

import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { useHasMounted } from '@/libs/hooks/useHasMounted';

export const Board = () => {
  const board = useBoardStore((state) => state.board);
  const updateBoardTitle = useBoardStore((state) => state.updateBoardTitle);
  const isMounted = useHasMounted();

  if (!isMounted) return null;

  return (
    <div className="board-container">
      <header className="board-header">
        <InlineEdit
          value={board.title}
          onSave={updateBoardTitle}
          className="board-title"
        />
      </header>

      <main className="board-canvas">
        {/* Placeholder for lists */}
        {board.lists.map((list) => (
          <div key={list.id} className="list-wrapper placeholder">
            {list.title}
          </div>
        ))}

        <button className="add-list-button">+ Add another list</button>
      </main>
    </div>
  );
};
