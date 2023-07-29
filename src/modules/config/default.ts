import { BaseConfig } from "./types";

export default class DefaultConfig implements BaseConfig {
  public numberOfWords = 6;
  public allowedFails = 3;
  public failedWordDisplayMs = 2000;
}
