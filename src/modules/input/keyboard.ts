import { BaseInputModule, InputEventsHandler } from "./types";

export default class KeyboardInputModule extends BaseInputModule {
  constructor(inputHandler: InputEventsHandler) {
    super(inputHandler);

    this.init();
  }

  public init() {
    document.addEventListener("keypress", (event) => {
      const pressedKey = event.key;

      if (!this.isKeyAllowed(pressedKey)) {
        return;
      }

      this.inputHandler.handleKeyPress(pressedKey);
    });
  }

  private isKeyAllowed(key: string): boolean {
    return /^[a-z]$/i.test(key);
  }
}
