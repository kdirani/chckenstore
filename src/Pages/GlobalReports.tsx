import { Table } from "react-bootstrap";
import FarmsFilter from "../components/FarmsFilter";
import { mockDailyReports } from "../mockData";
import { filterReportsBeforeDate, getNextDay, getPreviousCumulative, getPreviousReportByFarm } from "../utils";
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
          </tr>
        </tbody>
      </Table>
    </div>
  )
}