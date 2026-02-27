'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { List as ListType } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { AddAction } from '../shared/AddAction';
import { ListActions } from './ListActions';
import { Card } from './Card';
import { cn } from '@/libs/utils/cn';

interface ListProps {
  list: ListType;
  index: number;
}

export const List = ({ list, index }: ListProps) => {
  const updateListTitle = useBoardStore((state) => state.updateListTitle);
  const addCard = useBoardStore((state) => state.addCard);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn('list-container', { 'is-dragging': snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <header className="list-header">
            <InlineEdit
              value={list.title}
              onSave={(title) => updateListTitle(list.id, title)}
              className="list-title"
            />
            <ListActions listId={list.id} />
          </header>

          <Droppable droppableId={list.id} type="card">
            {(provided, snapshot) => (
              <div
                className={cn('list-cards', {
                  'is-dragging-over': snapshot.isDraggingOver,
                })}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {list.cards.map((card, index) => (
                  <Card key={card.id} card={card} listId={list.id} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <footer className="list-footer">
            <AddAction
              onAdd={(title) => addCard(list.id, title)}
              buttonText="Add a card"
              placeholder="Enter a title for this card..."
              submitText="Create card"
              isTextArea
            />
          </footer>
        </div>
      )}
    </Draggable>
  );
};
