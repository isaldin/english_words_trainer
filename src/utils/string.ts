import { Char } from "../types";

export const stringFromChars = (chars: Char[]): string => chars.map((item) => item.value).join("");
