export const exportPdf = (htmlContent: string) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Export PDF</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 40px;
      line-height: 1.6;
    }

    @media print {
      body {
        padding: 0;
      }
    }

    pre {
      background: #f5f5f5;
      padding: 12px;
    }

    code {
      background: #eee;
      padding: 2px 4px;
    }

    table {
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 6px 10px;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`);

  printWindow.document.close();

  printWindow.focus();

  // даём браузеру отрендерить
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};
