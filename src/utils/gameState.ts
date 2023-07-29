import { Char, GameState, Word } from "../types";
import { shuffleArray } from "./array";
import { deepClone } from "./object";

export const getCurrentWord = (gameState: GameState): Word =>
  gameState.words[gameState.currentWordIndex];

export const getCharsFromString = (input: string): Char[] =>
  input.split("").map((item, idx) => ({ value: item, position: idx }));

export const getInitialState = (words: string[]): GameState => ({
  words: words.map((item) => ({
    value: getCharsFromString(item),
    shuffledLetters: shuffleArray(getCharsFromString(item)),
    currentLetterIndex: 0,
    fails: 0,
    isFailed: false,
  })),
  currentWordIndex: 0,
});

export const isGameOver = (gameState: GameState): boolean =>
  gameState.currentWordIndex === gameState.words.length;

export const moveLetterToAnswer = (gameState: GameState, position: number): GameState => {
  const { currentWordIndex } = gameState;
  const currentWord = getCurrentWord(gameState);

  // index of the Char in the shuffled chars array
  const idx = currentWord.shuffledLetters.findIndex((item) => item.position === position);

  currentWord.shuffledLetters.splice(idx, 1);
  currentWord.currentLetterIndex = currentWord.currentLetterIndex + 1;

  delete currentWord.highlightedPosition;

  const newWords = gameState.words;
  newWords[currentWordIndex] = currentWord;

  const newCurrentWordIndex =
    currentWord.shuffledLetters.length === 0 ? currentWordIndex + 1 : currentWordIndex;

  return {
    words: newWords,
    currentWordIndex: newCurrentWordIndex,
  };
};

export const addFailedAttemptForCurrentWord = (
  gameState: GameState,
  highlightedPosition?: number,
): GameState => {
  const currentWordIndex = gameState.currentWordIndex;
  const currentWord = getCurrentWord(gameState);

  const updatedWord: Word = {
    ...currentWord,
    fails: currentWord.fails + 1,
    highlightedPosition,
  };

  const newWords = gameState.words;
  newWords[currentWordIndex] = updatedWord;

  return {
    ...gameState,
    words: newWords,
  };
};

export const setCurrentWordAsFailed = (gameState: GameState): GameState => {
  const { currentWordIndex } = gameState;

  const newGameState = deepClone(gameState);
  newGameState.words[currentWordIndex].isFailed = true;

  return newGameState;
};

export const goToNextWord = (gameState: GameState): GameState => {
  return {
    ...gameState,
    currentWordIndex: gameState.currentWordIndex + 1,
  };
};
