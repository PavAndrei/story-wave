// features/markdown/import-export.ts
export const exportMarkdown = (content: string, filename = "document.md") => {
  const blob = new Blob([content], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importMarkdownFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".md")) {
      reject(new Error("Only .md files are supported"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result ?? ""));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};
