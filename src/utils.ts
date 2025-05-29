import { mockDailyReports } from "./mockData";
import type { IDailyReport } from "./models";

export const  getFoodPercentage = (foodAmount: number, checkensAmount: number) => {
  const foodInG = foodAmount * 1000;
  return (foodInG / checkensAmount).toFixed(2) + '%';
}

export const calculatePercentageAndTotal = (part: number, total: number) => {
  if (total === 0) {
    throw new Error('Total cannot be zero.');
  }

  const percentage = (part / total) * 100;
  return `${parseFloat(percentage.toFixed(2))}%`;
}

export const getTotalSale = (report: IDailyReport) => {
  const amounts: number[] = [];
  mockDailyReports.forEach((item) => {
    const currentDate = new Date(report.date).getTime();
    const itemDate = new Date(item.date).getTime();
    if (itemDate < currentDate) {
      amounts.push(
        item.production +
          item.distortedProduction -
          item.sale.reduce((acc, it) => acc + it.amount, 0)
      );
    }
  });
  const total = amounts.reduce((acc, amount) => acc + amount, 0);
  const finalAmount =
    report.production +
    report.distortedProduction -
    report.sale.reduce((acc, it) => acc + it.amount, 0) +
    total;
  return finalAmount;
};
export const getCheckenAmountBefore = (
  report: IDailyReport,
  init: number = 40000
) => {
  const amounts: number[] = [];
  if (mockDailyReports.indexOf(report) === 0) return init;
  mockDailyReports.forEach((item) => {
    const currentDate = new Date(report.date).getTime();
    const itemDate = new Date(item.date).getTime();
    if (itemDate < currentDate) {
      amounts.push(item.death);
    }
  });
  const total = amounts.reduce((acc, amount) => acc + amount, 0);
  return init - total;
};

export const getCartorCalc = (report: IDailyReport) => {
  const cartonAmount = report.production / 100;
  const unneededCarton = report.production / 1000;
  return cartonAmount + unneededCarton;
};