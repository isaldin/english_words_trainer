import { BaseInputModule } from "../../input/types";
import { BaseDisplayModule } from "../types";
import { GameResult, GameState, Word } from "../../../types";
import PageObject from "./pageObject";
import { deepClone, objectsIsEqual } from "../../../utils/object";
import { getCurrentWord } from "../../../utils/gameState";

export default class DefaultDisplayModule
  extends BaseInputModule
  implements BaseDisplayModule<GameState>
{
  private _currentState?: GameState;

  private pageObject = new PageObject(this.handleLetterClick.bind(this));
  public updateState(newState: GameState, isNewGame?: boolean): void {
    if (isNewGame) {
      this._currentState = undefined;
      this.hideStatistic();
    }

    const currentWord = getCurrentWord(newState);

    if (this.isNewWord(newState, this._currentState)) {
      this.startNewWord(newState);
    } else if (this.isFail(newState, this._currentState!)) {
      if (currentWord.isFailed) {
        this.pageObject.failWord();
        return;
      }

      if (typeof currentWord.highlightedPosition === "number") {
        this.pageObject.highlightLetterWithPosition(currentWord.highlightedPosition);
      }
    } else if (this.isCorrectTurn(newState, this._currentState!)) {
      const addedLetter = currentWord.value[currentWord.currentLetterIndex - 1];
      this.pageObject.addLettersToAnswerContainer([addedLetter]);
      this.pageObject.removeLetterFromLettersContainer(addedLetter);
    }

    this._currentState = deepClone(newState);
  }

  public showStatistic(result: GameResult, closeCallback: () => void) {
    this.pageObject.showGameStatistic(result, closeCallback);
  }

  private hideStatistic() {
    this.pageObject.hideGameStatistic();
  }

  private handleLetterClick(letter: string, idx?: number) {
    this.inputHandler.handleKeyPress(letter, idx);
  }

  private isNewWord(newState: GameState, prevState?: GameState): boolean {
    return prevState?.currentWordIndex !== newState.currentWordIndex;
  }

  private isCorrectTurn(newState: GameState, prevState: GameState): boolean {
    return !objectsIsEqual(newState, prevState);
  }

  private isFail(newState: GameState, prevState: GameState): boolean {
    const prevFails = getCurrentWord(prevState).fails;
    const newFails = getCurrentWord(newState).fails;

    return prevFails !== newFails;
  }

  private startNewWord(state: GameState) {
    const currentWord = getCurrentWord(state);
    const { currentLetterIndex } = currentWord;
    const answeredLetters = currentWord.value.slice(0, currentLetterIndex);

    this.pageObject.addLettersToLettersContainer(getCurrentWord(state).shuffledLetters);
    this.pageObject.addLettersToAnswerContainer(answeredLetters, true);
    this.pageObject.updateQuestionsStatus(state.currentWordIndex + 1, state.words.length);
  }
}
