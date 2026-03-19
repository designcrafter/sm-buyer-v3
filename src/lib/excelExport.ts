import * as XLSX from 'xlsx';

export interface ExportData {
  [key: string]: string | number | boolean | null;
}

export function exportToExcel(data: ExportData[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => String(row[key] || '').length)
    ) + 2
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
}
