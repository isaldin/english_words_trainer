import { BaseStorageModule } from "./types";
import { Dict, Maybe } from "../../types";

export default class LocalStorageModule implements BaseStorageModule {
  public get<T extends Dict>(key: string): Maybe<T> {
    try {
      return JSON.parse(localStorage.getItem(key)!) as T;
    } catch {
      return undefined;
    }
  }

  public set(key: string, data: Dict): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }
}
