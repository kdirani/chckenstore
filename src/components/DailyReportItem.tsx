import type { IDailyReport } from "../models";
import { calculatePercentageAndTotal, getCartorCalc, getCheckenAmountBefore, getFoodPercentage, getPreviousCumulative } from "../utils";

export default function DailyReportItem(props: {
  dailyReports: IDailyReport[];
}) {
  return (
    <>
      {props.dailyReports.map((item, index) => (
        <tr key={item.date + item.time + index}>
          <td>{index}</td>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td>{item.production}</td>
          <td>{item.distortedProduction}</td>
          <td>{getCartorCalc(item)}</td>
          <td>{item.sale.reduce((acc, it) => acc + it.amount, 0)}</td>
          <td>{getPreviousCumulative(item, props.dailyReports)}</td>
          <td>
            {(item.production + item.distortedProduction) * 30}
          </td>
          <td>
            {calculatePercentageAndTotal(
              (item.production + item.distortedProduction) * 30,
              getCheckenAmountBefore(item, undefined, props.dailyReports)
            )}
          </td>
          <td>{getCheckenAmountBefore(item, undefined, props.dailyReports)}</td>
          <td>{item.death}</td>
          <td>{getCheckenAmountBefore(item, undefined, props.dailyReports) - item.death}</td>
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