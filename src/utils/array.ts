export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  // Проверяем, одинаковая ли длина у массивов
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Сравниваем элементы массивов
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // Если все проверки пройдены, массивы равны
  return true;
}