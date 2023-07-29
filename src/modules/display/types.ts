import { GameResult } from "../../types";

export interface BaseDisplayModule<T> {
  updateState(newState: T, isNewGame?: boolean): void;
  showStatistic(result: GameResult, closeCallback: () => void): void;
}
