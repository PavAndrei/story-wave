export const exportHtml = (htmlContent: string, filename = "document.html") => {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Export</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      padding: 40px;
      max-width: 900px;
      margin: auto;
    }

    pre {
      background: #f5f5f5;
      padding: 12px;
      overflow-x: auto;
    }

    code {
      background: #f0f0f0;
      padding: 2px 4px;
      border-radius: 4px;
    }

    table {
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 6px 10px;
    }

    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 12px;
      color: #555;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
