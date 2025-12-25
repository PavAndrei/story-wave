export const renumberOrderedList = (value: string, cursor: number) => {
  const lines = value.split("\n");

  // определить индекс строки курсора
  let lineIndex = 0;
  let acc = 0;

  for (let i = 0; i < lines.length; i++) {
    acc += lines[i].length + 1;
    if (acc > cursor) {
      lineIndex = i;
      break;
    }
  }

  const isOl = (line: string) => /^\d+\.\s+/.test(line);

  // если текущая строка не OL — ищем ближайший OL выше
  let probe = lineIndex;
  while (probe >= 0 && !isOl(lines[probe])) {
    probe--;
  }

  if (probe < 0) return value;

  // найти начало списка
  let start = probe;
  while (start > 0 && isOl(lines[start - 1])) {
    start--;
  }

  // найти конец списка
  let end = probe;
  while (end < lines.length - 1 && isOl(lines[end + 1])) {
    end++;
  }

  // перенумерация
  let counter = 1;
  for (let i = start; i <= end; i++) {
    lines[i] = lines[i].replace(/^\d+\.\s+/, `${counter}. `);
    counter++;
  }

  return lines.join("\n");
};
