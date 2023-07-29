export interface BaseDataSource {
  getWords(count: number): string[];
}
