import './App.css';
import { mockDailyReports } from './mockData';
import type { IDailyReport } from './models';

function App() {
  return (
    <div style={{ width: '1500px' }}>
      <h1>1</h1>
      <table border={1}>
        <thead>
          <th>التاريخ</th>
          <th>التوقيت</th>
          <th>الإنتاج</th>
          <th>الإنتاج المشوه</th>
          <th>الكرتون</th>
          <th>المبيع</th>
          <th>التراكمي</th>
          <th>الإنتاج\البيض</th>
          <th>نسبة الإنتاج</th>
          <th>عدد الفرخة قبل</th>
          <th>النفوق</th>
          <th>عدد الفرخة بعد</th>
          <th>العلف</th>
          <th>نسبة استهلاك العلف</th>
          <th>كمية السواد المنتج</th>
        </thead>
        <tbody>
          <Test />
        </tbody>
      </table>
    </div>
  );
}

function Test() {
  const getTotalSale = (report: IDailyReport) => {
    const amounts: number[] = [];
    mockDailyReports.forEach((item) => {
      const currentDate = new Date(report.date).getTime();
      const itemDate = new Date(item.date).getTime();
      if (itemDate < currentDate) {
        amounts.push(
          item.production.amount +
            item.distortedProduction.amount -
            item.sale.reduce((acc, it) => acc + it.amount, 0)
        );
      }
    });
    const total = amounts.reduce((acc, amount) => acc + amount, 0);
    const finalAmount =
      report.production.amount +
      report.distortedProduction.amount -
      report.sale.reduce((acc, it) => acc + it.amount, 0) +
      total;
    return finalAmount;
  };
  const getCheckenAmountBefore = (
    report: IDailyReport,
    init: number = 40000
  ) => {
    const amounts: number[] = [];
    if (mockDailyReports.indexOf(report) === 0) return init;
    mockDailyReports.forEach((item) => {
      const currentDate = new Date(report.date).getTime();
      const itemDate = new Date(item.date).getTime();
      if (itemDate < currentDate) {
        amounts.push(item.death.amount);
      }
    });
    const total = amounts.reduce((acc, amount) => acc + amount, 0);
    return init - total;
  };
  const getCartorCalc = (report: IDailyReport) => {
    const cartonAmount = report.production.amount / 100;
    const unneededCarton = report.production.amount / 1000;
    return cartonAmount + unneededCarton;
  };
  return (
    <>
      {mockDailyReports.map((item) => (
        <tr>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td>{item.production.amount}</td>
          <td>{item.distortedProduction.amount}</td>
          <td>{getCartorCalc(item)}</td>
          <td>{item.sale.reduce((acc, it) => acc + it.amount, 0)}</td>
          <td>{getTotalSale(item)}</td>
          <td>
            {(item.production.amount + item.distortedProduction.amount) * 30}
          </td>
          <td>
            {calculatePercentageAndTotal(
              (item.production.amount + item.distortedProduction.amount) * 30,
              getCheckenAmountBefore(item)
            )}
          </td>
          <td>{getCheckenAmountBefore(item)}</td>
          <td>{item.death.amount}</td>
          <td>{getCheckenAmountBefore(item) - item.death.amount}</td>
          <td>{item.dailyFood.amount}</td>
          <td>
            {getFoodPercentage(
              item.dailyFood.amount,
              40000 - item.death.amount
            )}
          </td>
          <td>{item.darkMeat.amount}</td>
        </tr>
      ))}
    </>
  );
}

function getFoodPercentage(foodAmount: number, checkensAmount: number) {
  const foodInG = foodAmount * 1000;
  return (foodInG / checkensAmount).toFixed(2) + '%';
}

function calculatePercentageAndTotal(part: number, total: number) {
  if (total === 0) {
    throw new Error('Total cannot be zero.');
  }

  const percentage = (part / total) * 100;
  return `${parseFloat(percentage.toFixed(2))}%`;
}

export default App;
