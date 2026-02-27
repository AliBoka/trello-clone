'use client';

import { List as ListType } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';
import { InlineEdit } from '../shared/InlineEdit';
import { AddAction } from '../shared/AddAction';
import { ListActions } from './ListActions';
import { Card } from './Card';

interface ListProps {
  list: ListType;
}

export const List = ({ list }: ListProps) => {
  const updateListTitle = useBoardStore((state) => state.updateListTitle);
  const addCard = useBoardStore((state) => state.addCard);

  return (
    <div className="list-container">
      <header className="list-header">
        <InlineEdit
          value={list.title}
          onSave={(title) => updateListTitle(list.id, title)}
          className="list-title"
        />
        <ListActions listId={list.id} />
      </header>

      <div className="list-cards">
        {list.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      <footer className="list-footer">
        <AddAction
          onAdd={(title) => addCard(list.id, title)}
          buttonText="Add another card"
          placeholder="Enter a card title... (shift + enter for a new line)"
          submitText="Create card"
          isTextArea
        />
      </footer>
    </div>
  );
};
