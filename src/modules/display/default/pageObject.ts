import { Char, GameResult } from "../../../types";

export default class PageObject {
  private gameAreaContainer: HTMLElement = document.getElementById("game_area")!;
  private gameStatisticContainer: HTMLElement = document.getElementById("game_statistic")!;

  // game area elements
  private lettersContainer: HTMLElement = document.getElementById("letters")!;
  private answerContainer: HTMLElement = document.getElementById("answer")!;
  private currentQuestion: HTMLElement = document.getElementById("current_question")!;
  private totalQuestions: HTMLElement = document.getElementById("total_questions")!;

  // game statistic elements
  private passedWords: HTMLElement = document.getElementById("passed_words")!;
  private totalErrors: HTMLElement = document.getElementById("total_errors")!;
  private mostFailedWord: HTMLElement = document.getElementById("most_failed_word")!;
  private closeStatisticButton: HTMLElement = document.getElementById("close_statistic_btn")!;

  constructor(private inputHandler: (letter: string, idx?: number) => void) {}

  public addLettersToLettersContainer(letters: Char[]) {
    this.clearContainer(this.lettersContainer);

    letters.forEach((char) => {
      this.lettersContainer.appendChild(this.getLetterElement(char, ["withCursor", "blue"]));
    });
  }

  public addLettersToAnswerContainer(letters: Char[], clear = false) {
    if (clear) {
      this.clearContainer(this.answerContainer);
    }

    letters.forEach((char) => {
      this.answerContainer.appendChild(this.getLetterElement(char, ["green"]));
    });
  }

  public highlightLetterWithPosition(position: number) {
    const arrayIdx = Array.from(this.lettersContainer.children).findIndex((item) => {
      return this.isHTMLElement(item) && item.dataset.position === `${position}`;
    });
    const element = this.lettersContainer.children.item(arrayIdx);
    element?.classList.add("error");
    setTimeout(() => {
      element?.classList.remove("error");
    }, 500);
  }

  public removeLetterFromLettersContainer(letter: Char) {
    Array.from(this.lettersContainer.children).forEach((item) => {
      if (!this.isHTMLElement(item)) {
        return;
      }

      if (item.dataset.position === `${letter.position}`) {
        item.remove();
      }
    });
  }

  public updateQuestionsStatus(current: number, total: number) {
    this.currentQuestion.innerText = `${current}`;
    this.totalQuestions.innerText = `${total}`;
  }

  public failWord() {
    const restLetters = Array.from(this.lettersContainer.children).sort((a, b) => {
      if (!this.isHTMLElement(a) || !this.isHTMLElement(b)) {
        return 0;
      }

      return +a.dataset.position! - +b.dataset.position!;
    });

    restLetters.forEach((item) => this.answerContainer.appendChild(item));

    Array.from(this.answerContainer.children).forEach((item) => item.classList.add("error"));
  }

  public showGameStatistic(gameStatistic: GameResult, closeCallback: () => void) {
    this.gameAreaContainer.style.display = "none";
    this.gameStatisticContainer.style.display = "block";

    this.passedWords.innerText = `${gameStatistic.passedWordsNumber}`;
    this.totalErrors.innerText = `${gameStatistic.errorsNumber}`;
    this.mostFailedWord.innerText = ` ${gameStatistic.mostFailedWord.value} (${gameStatistic.mostFailedWord.fails})`;

    this.closeStatisticButton.addEventListener("click", closeCallback);
  }

  public hideGameStatistic() {
    this.gameAreaContainer.style.display = "block";
    this.gameStatisticContainer.style.display = "none";
  }

  private getLetterElement(letter: Char, additionalClasses: string[] = []): HTMLSpanElement {
    const letterSpan = document.createElement("span");

    letterSpan.classList.add("letter");
    additionalClasses.forEach((item) => {
      letterSpan.classList.add(item);
    });

    letterSpan.textContent = letter.value;
    letterSpan.dataset.char = letter.value;
    letterSpan.dataset.position = `${letter.position}`;

    letterSpan.addEventListener("click", this.clickHandler);

    return letterSpan;
  }

  private clearContainer(container: HTMLElement) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  clickHandler = (event: MouseEvent) => {
    if (!this.isHTMLElement(event.target)) {
      return;
    }

    const { dataset: { char, position } = {} } = event.target;
    this.inputHandler(char!, +position!);
  };

  private isHTMLElement(el: unknown): el is HTMLElement {
    return el instanceof HTMLElement;
  }
}
