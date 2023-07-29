import { Dict } from "../types";

// so simple comparison
export const objectsIsEqual = (a: Dict, b: Dict): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export const deepClone = <T extends Dict>(pbj: T): T => JSON.parse(JSON.stringify(pbj));
