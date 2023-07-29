import { Dict, Maybe } from "../../types";

export interface BaseStorageModule {
  set(key: string, data: Dict): void;
  get<T extends Dict>(key: string): Maybe<T>;
  remove(key: string): void;
}
