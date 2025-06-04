import { Table } from "react-bootstrap";
import DailyReportItem from "../components/DailyReportItem";
import FarmsFilter from "../components/FarmsFilter";
import { useSelectedFarmContext } from "../contexts";
import { useEffect, useState } from "react";
import type { IRecursiveFarm } from "../models";
import { reportsService } from "../lib/appwrite";
import { Query } from "appwrite";

export default function DailyReport() {
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IRecursiveFarm[]>([]);
  useEffect(() => {
    if(!selectedFarm) return
    console.log(selectedFarm);
    
    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert('Error in reports fetch'),
        [
          Query.equal('farmId', selectedFarm || '')
        ]
      )
    }
    init()
  }, [selectedFarm])
  console.log(reports);
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
            dailyReports={reports}
          />
        </tbody>
      </Table>
    </div>
  )
}