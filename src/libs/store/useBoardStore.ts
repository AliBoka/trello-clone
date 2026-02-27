import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Board } from '@/types';

interface BoardState {
  board: Board;
  updateBoardTitle: (title: string) => void;
  addList: (title: string) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, title: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteAllCards: (listId: string) => void;
  activeCardId: string | null;
  activeListId: string | null;
  setActiveCard: (listId: string | null, cardId: string | null) => void;
  updateCardTitle: (listId: string, cardId: string, title: string) => void;
  addComment: (listId: string, cardId: string, text: string) => void;
  moveList: (sourceIndex: number, destinationIndex: number) => void;
  moveCard: (
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
}

const initialBoard: Board = {
  id: 'board-1',
  title: 'Demo Board',
  lists: [
    {
      id: 'list-1',
      title: 'Todo',
      cards: [{ id: 'card-1', title: 'Review Drag & Drop', comments: [] }],
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [],
    },
  ],
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      board: initialBoard,
      activeCardId: null,
      activeListId: null,

      updateBoardTitle: (title) =>
        set((state) => ({
          board: { ...state.board, title },
        })),

      addList: (title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: [...state.board.lists, { id: uuidv4(), title, cards: [] }],
          },
        })),

      deleteList: (listId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.filter((list) => list.id !== listId),
          },
        })),

      addCard: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: [...list.cards, { id: uuidv4(), title, comments: [] }],
                  }
                : list
            ),
          },
        })),

      deleteCard: (listId, cardId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.filter((card) => card.id !== cardId),
                  }
                : list
            ),
          },
        })),
      updateListTitle: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId ? { ...list, title } : list
            ),
          },
        })),

      deleteAllCards: (listId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId ? { ...list, cards: [] } : list
            ),
          },
        })),

      setActiveCard: (listId, cardId) =>
        set({ activeListId: listId, activeCardId: cardId }),

      updateCardTitle: (listId, cardId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId ? { ...card, title } : card
                    ),
                  }
                : list
            ),
          },
        })),
      addComment: (listId, cardId, text) =>
        set((state) => {
          // 1. Create the new comment object
          const newComment = {
            id: uuidv4(),
            text,
            createdAt: Date.now(),
          };

          // 2. Map through lists and update only the target list
          const updatedLists = state.board.lists.map((list) => {
            // Early return if it's not the target list
            if (list.id !== listId) return list;

            // 3. Map through cards within the target list
            const updatedCards = list.cards.map((card) => {
              // Early return if it's not the target card
              if (card.id !== cardId) return card;

              // 4. Append the new comment to the target card
              return {
                ...card,
                comments: [...card.comments, newComment],
              };
            });

            // Return the updated list with the new cards array
            return { ...list, cards: updatedCards };
          });

          // 5. Return the final updated board state
          return {
            board: {
              ...state.board,
              lists: updatedLists,
            },
          };
        }),

      moveList: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newLists = Array.from(state.board.lists);
          const [reorderedList] = newLists.splice(sourceIndex, 1);
          newLists.splice(destinationIndex, 0, reorderedList);

          return { board: { ...state.board, lists: newLists } };
        }),

      moveCard: (sourceListId, destListId, sourceIndex, destIndex) =>
        set((state) => {
          const newLists = Array.from(state.board.lists);

          const sourceListIndex = newLists.findIndex((l) => l.id === sourceListId);
          const destListIndex = newLists.findIndex((l) => l.id === destListId);

          // Fallback in case lists aren't found
          if (sourceListIndex === -1 || destListIndex === -1) return state;

          const sourceList = { ...newLists[sourceListIndex] };
          const destList =
            sourceListId === destListId ? sourceList : { ...newLists[destListIndex] };

          const sourceCards = Array.from(sourceList.cards);
          const destCards =
            sourceListId === destListId ? sourceCards : Array.from(destList.cards);

          // Remove card from source
          const [movedCard] = sourceCards.splice(sourceIndex, 1);

          // Insert card into destination
          destCards.splice(destIndex, 0, movedCard);

          // Update the lists
          sourceList.cards = sourceCards;
          if (sourceListId !== destListId) {
            destList.cards = destCards;
            newLists[destListIndex] = destList;
          }
          newLists[sourceListIndex] = sourceList;

          return { board: { ...state.board, lists: newLists } };
        }),
    }),
    {
      name: 'trello-storage',
    }
  )
);
