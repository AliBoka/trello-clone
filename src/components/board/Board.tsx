'use client';

import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { useHasMounted } from '@/libs/hooks/useHasMounted';
import { AddAction } from '../shared/AddAction';
import { List } from './List';

export const Board = () => {
  const board = useBoardStore((state) => state.board);
  const updateBoardTitle = useBoardStore((state) => state.updateBoardTitle);
  const addList = useBoardStore((state) => state.addList);

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
        {board.lists.map((list) => (
          <List key={list.id} list={list} />
        ))}

        <AddAction
          onAdd={addList}
          buttonText="Add another list"
          placeholder="Enter list title..."
          isBoardLevel
        />
      </main>
    </div>
  );
};
