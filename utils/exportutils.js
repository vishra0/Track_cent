import ExcelJS from 'exceljs/dist/es5/exceljs.browser';
import { saveAs } from 'file-saver';

export const exportToExcel = async (incomes, expenses, filename = 'financial-data') => {
  const workbook = new ExcelJS.Workbook();
  
  // Income Sheet
  const incomeSheet = workbook.addWorksheet('Income');
  incomeSheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Source', key: 'source', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Description', key: 'description', width: 30 },
  ];

  incomes.forEach(income => {
    incomeSheet.addRow({
      date: new Date(income.date).toLocaleDateString(),
      source: income.source,
      amount: income.amount,
      description: income.description || '',
    });
  });

  // Expense Sheet
  const expenseSheet = workbook.addWorksheet('Expenses');
  expenseSheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Description', key: 'description', width: 30 },
  ];

  expenses.forEach(expense => {
    expenseSheet.addRow({
      date: new Date(expense.date).toLocaleDateString(),
      category: expense.category,
      amount: expense.amount,
      description: expense.description || '',
    });
  });

  // Style headers
  [incomeSheet, expenseSheet].forEach(sheet => {
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' }
    };
  });

  // Generate buffer and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${filename}.xlsx`);
};