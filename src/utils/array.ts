export const getRandomElement = <T>(array: Array<T>): T => {
  const randomIdx = Math.floor(Math.random() * array.length);

  return array[randomIdx];
};

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};
