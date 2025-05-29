import { Table } from "react-bootstrap";
import FarmsFilter from "../components/FarmsFilter";
import { mockDailyReports } from "../mockData";
import { filterReportsBeforeDate, filterReportsByPeriod, getAvarageOfDeath, getCheckenAmountBefore, getNextDay, getPreviousCumulative, getPreviousReportByFarm, totalize } from "../utils";
import { useSelectedFarmContext } from "../contexts";

export default function GlobalReports() {
  const selectedFarm = useSelectedFarmContext()[0];
  const currentReports = mockDailyReports.filter(report => report.farm === selectedFarm);
  const previousReport = getPreviousReportByFarm
  (
    currentReports,
    selectedFarm || '',
    new Date()
  )
  return (
    <div>
      <FarmsFilter></FarmsFilter>
      <h1>تقرير الإنتاج اليومي الشامل</h1>
      <Table>
        <thead>
          <tr>
            <td>تاريخ البداية</td>
            <td>تاريخ النهاية</td>
            <td>الرصيد التراكمي السابق</td>
            <td>كمية الإنتاج</td>
            <td>كمية المبيعات</td>
            <td>الرصيد التراكمي الحالي</td>
            <td>عدد الفرخة بداية الفلترة</td>
            <td>عدد النفوق ضمن فترة الفلترة</td>
            <td>عدد الفرخة نهاية الفلترة</td>
            <td>متوسط النفوق</td>
            <td>كمية العلف المستهلك</td>
            <td>عدد الأيام</td>
            <td>متوسط استهلاك الفرخة من العلف</td>
            <td>متوسط إنتاج البيض</td>
            <td>كمية السواد المنتج</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{new Date().toLocaleDateString()}</td>
            <td>{getNextDay().toLocaleDateString()}</td>
            <td>
              {previousReport ?
                getPreviousCumulative
                (
                  previousReport,
                  filterReportsBeforeDate(
                    currentReports,
                    new Date()
                  )
                )
              : (
                0
              )}
            </td>
            <td>{totalize(filterReportsByPeriod(currentReports, 'day'), 'production').amount}</td>
            <td>{totalize(filterReportsByPeriod(currentReports, 'day'), 'sale').amount}</td>
            <td>
              {filterReportsByPeriod(currentReports, 'day') ?
                getPreviousCumulative
                (
                  filterReportsByPeriod(currentReports, 'day')[0],
                  filterReportsBeforeDate(
                    currentReports,
                    new Date()
                  )
                )
              : (
                0
              )}
            </td>
            <td>
              {
                getCheckenAmountBefore(
                  filterReportsByPeriod(currentReports, 'day')[0] || previousReport,
                  undefined,
                  currentReports
                )
              }
            </td>
            <td>{totalize(filterReportsByPeriod(currentReports, 'day'), 'death').amount}</td>
            <td>
              {
                getCheckenAmountBefore(
                  filterReportsByPeriod(currentReports, 'day')[0] || previousReport,
                  undefined,
                  currentReports
                ) - totalize(filterReportsByPeriod(currentReports, 'day'), 'death').amount
              }
            </td>
            <td>{getAvarageOfDeath(filterReportsByPeriod(currentReports, 'day'), 'day')}</td>
            <td>{totalize(filterReportsByPeriod(currentReports, 'day'), 'dailyFood').amount}</td>
            {/* Convert this to props when refactor the component */}
            <td>1</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}