'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { useHasMounted } from '@/libs/hooks/useHasMounted';
import { AddAction } from '../shared/AddAction';
import { List } from './List';
import { CardModal } from '../modals/CardModal';

export const Board = () => {
  const { board, updateBoardTitle, addList, moveList, moveCard } = useBoardStore();
  const isMounted = useHasMounted();

  if (!isMounted) return null;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return; // Dropped outside a valid droppable area

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Dropped in the exact same position
    }

    if (type === 'list') {
      moveList(source.index, destination.index);
    } else if (type === 'card') {
      moveCard(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <InlineEdit
          value={board.title}
          onSave={updateBoardTitle}
          className="board-title"
        />
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="list">
          {(provided) => (
            <main
              className="board-canvas"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {board.lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}

              <AddAction
                onAdd={addList}
                buttonText="Add another list"
                placeholder="Enter list title..."
                submitText="Add list"
                isBoardLevel
              />
            </main>
          )}
        </Droppable>
      </DragDropContext>

      <CardModal />
    </div>
  );
};
