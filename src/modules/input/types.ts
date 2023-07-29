export abstract class BaseInputModule {
  constructor(protected inputHandler: InputEventsHandler) {}
}

export interface InputEventsHandler {
  handleKeyPress: (key: string, idx?: number) => void;
}
