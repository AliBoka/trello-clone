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
    }),
    {
      name: 'trello-storage',
    }
  )
);
