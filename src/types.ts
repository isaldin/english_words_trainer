export type Dict = Record<string, unknown>;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = Nullable<T> | Optional<T>;

export type GameState = {
  words: Word[];
  currentWordIndex: number;
};

export type GameResult = {
  passedWordsNumber: number;
  errorsNumber: number;
  mostFailedWord: { value: string; fails: number };
};

export type Char = {
  value: string;
  position: number;
};

export type Word = {
  value: Char[];
  shuffledLetters: Char[];
  currentLetterIndex: number;
  fails: number;
  highlightedPosition?: number;
  isFailed: boolean;
};
