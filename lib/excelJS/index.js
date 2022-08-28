export async function saveWorkBook (workbook, name) {
    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
    a.remove();
  };

  export const exportData = (headers,data) => {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("sheet1");
  
    worksheet.columns = headers;
  
    worksheet.addRows(data);
  
    return workbook;
  };