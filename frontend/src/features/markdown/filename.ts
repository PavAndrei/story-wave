// features/markdown/filename.ts

type FilenameOptions = {
  title?: string;
  fallbackId?: string;
};

export const getExportFilename = (
  markdown: string,
  options: FilenameOptions = {},
): string => {
  const { title, fallbackId } = options;

  // 1️⃣ Явный title
  if (title && title.trim()) {
    return normalizeFilename(title);
  }

  // 2️⃣ Первый markdown heading
  const heading = extractFirstHeading(markdown);
  if (heading) {
    return normalizeFilename(heading);
  }

  // 3️⃣ Fallback id
  if (fallbackId && fallbackId.trim()) {
    return normalizeFilename(fallbackId);
  }

  // 4️⃣ Default
  return "document";
};

const extractFirstHeading = (markdown: string): string | null => {
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^#\s+(.+)/);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
};

const normalizeFilename = (input: string): string => {
  return (
    input
      .toLowerCase()
      .trim()
      // убираем markdown / спецсимволы
      .replace(/[`*_~[\](){}<>#+=|.!?,:;"']/g, "")
      // заменяем пробелы и подряд идущие дефисы
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      // убираем дефисы по краям
      .replace(/^-|-$/g, "")
  );
};
