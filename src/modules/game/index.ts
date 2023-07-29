import { BaseInputModule, InputEventsHandler } from "../input/types";
import KeyboardInputModule from "../input/keyboard";
import DefaultDisplayModule from "../display/default";
import DefaultDataSource from "../dataSource/default";
import DefaultConfig from "../config/default";
import { BaseConfig } from "../config/types";
import { GameState } from "../../types";
import {
  addFailedAttemptForCurrentWord,
  getCurrentWord,
  getInitialState,
  goToNextWord,
  isGameOver,
  moveLetterToAnswer,
  setCurrentWordAsFailed,
} from "../../utils/gameState";
import { getGameResult } from "../../utils/gameResult";
import LocalStorageModule from "../storage/localStorage";

const GAME_STATE_STORAGE_KEY = "gameState:storageKey";

export default class GameModule implements InputEventsHandler {
  // in the ideal word should be retrieved from DI-container
  private kbInputModule: BaseInputModule;
  private displayModule: DefaultDisplayModule;
  private dataSource: DefaultDataSource;
  private config: BaseConfig;
  private storage: LocalStorageModule;

  private _inputIsAllowed = true;

  // @ts-ignore
  private _gameState: GameState;
  private get gameState(): GameState {
    return this._gameState;
  }

  private set gameState(gameState: GameState) {
    this._gameState = gameState;
    this.storage.set(GAME_STATE_STORAGE_KEY, gameState);

    if (isGameOver(gameState)) {
      this.storage.remove(GAME_STATE_STORAGE_KEY);

      this._inputIsAllowed = false;
      this.displayModule.showStatistic(getGameResult(gameState, this.config.allowedFails), () => {
        this._inputIsAllowed = true;
        this._gameState = this.getInitialState();
        this.storage.set(GAME_STATE_STORAGE_KEY, gameState);
        this.displayModule.updateState(this._gameState, true);
      });
    } else {
      this.displayModule.updateState(this._gameState);
    }

    // todo: save to localStorage
  }

  constructor() {
    this.kbInputModule = new KeyboardInputModule(this);
    this.displayModule = new DefaultDisplayModule(this);
    this.dataSource = new DefaultDataSource();
    this.config = new DefaultConfig();
    this.storage = new LocalStorageModule();

    if (this.storage.get(GAME_STATE_STORAGE_KEY)) {
      if (this.askForContinuePrevGame()) {
        this.gameState = this.storage.get(GAME_STATE_STORAGE_KEY) as GameState; // it would be great to add guard here
        return;
      }
    }

    this.startGame();
  }

  public handleKeyPress(key: string, position?: number): void {
    if (!this._inputIsAllowed) {
      return;
    }

    const currentWord = getCurrentWord(this.gameState);

    position = position ?? currentWord.shuffledLetters.find((item) => item.value === key)?.position;

    const gameState = ((position) => {
      // pressed letter is not in the word
      if (position === undefined) {
        return addFailedAttemptForCurrentWord(this.gameState);
      }
      // pressed letter is in the word but on wrong place
      else if (key !== currentWord.value[currentWord.currentLetterIndex].value) {
        return addFailedAttemptForCurrentWord(this.gameState, position);
      }
      // pressed letter is correct
      else {
        return moveLetterToAnswer(this.gameState, position);
      }
    })(position);

    if (!isGameOver(gameState) && getCurrentWord(gameState).fails > this.config.allowedFails) {
      this.gameState = setCurrentWordAsFailed(this.gameState);
      this._inputIsAllowed = false;
      setTimeout(() => {
        this.gameState = goToNextWord(this.gameState);
        this._inputIsAllowed = true;
      }, this.config.failedWordDisplayMs);
    } else {
      this.gameState = gameState;
    }
  }

  private getInitialState(): GameState {
    return getInitialState(this.dataSource.getWords(this.config.numberOfWords));
  }

  private startGame() {
    this.gameState = this.getInitialState();
  }

  private askForContinuePrevGame() {
    return confirm("Continue previous game?");
  }
}
