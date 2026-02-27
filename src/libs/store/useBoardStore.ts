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
    }),
    {
      name: 'trello-storage',
    }
  )
);
