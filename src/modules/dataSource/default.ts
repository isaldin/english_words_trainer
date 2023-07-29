import { BaseDataSource } from "./types";
import { getRandomElement } from "../../utils/array";

export default class DefaultDataSource implements BaseDataSource {
  private words = [
    "apple",
    "function",
    "timeout",
    "task",
    "application",
    "data",
    "tragedy",
    "sun",
    "symbol",
    "button",
    "software",
  ];

  public getWords(count: number): string[] {
    const result: Set<string> = new Set();

    while (result.size < count) {
      result.add(getRandomElement(this.words));
    }

    return [...result];
  }
}
