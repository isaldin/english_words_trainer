import { GameResult, GameState } from "../types";
import { stringFromChars } from "./string";

export const getGameResult = (gameState: GameState, allowedFails: number): GameResult =>
  gameState.words.reduce(
    (acc, item) => {
      if (item.fails <= allowedFails) {
        acc.passedWordsNumber += 1;
      }

      if (acc.mostFailedWord.fails < item.fails) {
        acc.mostFailedWord = { value: stringFromChars(item.value), fails: item.fails };
      }

      acc.errorsNumber += item.fails;

      return acc;
    },
    {
      passedWordsNumber: 0,
      errorsNumber: 0,
      mostFailedWord: { value: "", fails: 0 },
    } as GameResult,
  );
