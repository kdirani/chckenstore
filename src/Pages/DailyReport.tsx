import { Table } from "react-bootstrap";
import DailyReportItem from "../components/DailyReportItem";
import FarmsFilter from "../components/FarmsFilter";
import { useSelectedFarmContext } from "../contexts";
import { mockDailyReports } from "../mockData";

export default function DailyReport() {
  const selectedFarm = useSelectedFarmContext()[0];
  return (
    <div>
      <h1>التقرير الإنتاج اليومي</h1>
      <FarmsFilter></FarmsFilter>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
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
          </tr>
        </thead>
        <tbody>
          <DailyReportItem
            dailyReports={mockDailyReports.filter(report => report.farm === selectedFarm)}
          />
        </tbody>
      </Table>
    </div>
  )
}