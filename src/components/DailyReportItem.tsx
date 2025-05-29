import { mockDailyReports } from "../mockData";
import { calculatePercentageAndTotal, getCartorCalc, getCheckenAmountBefore, getFoodPercentage, getTotalSale } from "../utils";

export default function DailyReportItem() {
  return (
    <>
      {mockDailyReports.map((item) => (
        <tr key={item.date + item.time}>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td>{item.production}</td>
          <td>{item.distortedProduction}</td>
          <td>{getCartorCalc(item)}</td>
          <td>{item.sale.reduce((acc, it) => acc + it.amount, 0)}</td>
          <td>{getTotalSale(item)}</td>
          <td>
            {(item.production + item.distortedProduction) * 30}
          </td>
          <td>
            {calculatePercentageAndTotal(
              (item.production + item.distortedProduction) * 30,
              getCheckenAmountBefore(item)
            )}
          </td>
          <td>{getCheckenAmountBefore(item)}</td>
          <td>{item.death}</td>
          <td>{getCheckenAmountBefore(item) - item.death}</td>
          <td>{item.dailyFood}</td>
          <td>
            {getFoodPercentage(
              item.dailyFood,
              40000 - item.death
            )}
          </td>
          <td>{item.darkMeat.amount}</td>
        </tr>
      ))}
    </>
  )
}