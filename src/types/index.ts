export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Card {
  id: string;
  title: string;
  comments: Comment[];
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}
