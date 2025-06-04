import { Form, Table } from "react-bootstrap";
import FarmsFilter from "../components/FarmsFilter";
import { useSelectedFarmContext } from "../contexts";
import { mockDailyReports } from "../mockData";
import { useMemo, useState } from "react";
import type { FilterDateMod } from "../models";
import { groupReportsByPeriod } from "../utils";
import GlobalReportsRecordItem from "../components/GlobalReportsRecordItem";

export default function GlobalReportsRecord() {
  const [selectedFarm] = useSelectedFarmContext();
  const [dateMode, setDateMode] = useState<FilterDateMod>("day");

  // Filter only the reports for the selected farm
  const currentReports = useMemo(
    () => mockDailyReports.filter((x) => x.farmId === selectedFarm),
    [selectedFarm]
  );

  // Group them by day/week/month
  const groupedReports = useMemo(() => {
    if (!currentReports || currentReports.length === 0) {
      return [];
    }
    return groupReportsByPeriod(currentReports, dateMode);
  }, [currentReports, dateMode]);

  if (!currentReports || currentReports.length === 0) {
    return <div>لا توجد تقارير متاحة</div>;
  }

  return (
    <div>
      <h1>سجل التقارير الشاملة</h1>

      <FarmsFilter />

      <Form className="mb-3">
        <Form.Group>
          <Form.Select
            onChange={(e) => setDateMode(e.target.value as FilterDateMod)}
            value={dateMode}
          >
            <option value="day">يومي</option>
            <option value="week">اسبوعي</option>
            <option value="month">شهري</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>تاريخ البداية</th>
            <th>تاريخ النهاية</th>
            <th>الرصيد التراكمي السابق</th>
            <th>كمية الإنتاج</th>
            <th>كمية المبيعات</th>
            <th>الرصيد التراكمي الحالي</th>
            <th>عدد الفرخة بداية الفلترة</th>
            <th>عدد النفوق ضمن فترة الفلترة</th>
            <th>عدد الفرخة نهاية الفلترة</th>
            <th>متوسط النفوق</th>
            <th>كمية العلف المستهلك</th>
            <th>عدد الأيام</th>
            <th>متوسط استهلاك الفرخة من العلف</th>
            <th>كمية السواد المنتج</th>
            <th>متوسط إنتاج البيض</th>
          </tr>
        </thead>

        <tbody>
          {groupedReports.map((group, index) => (
            <tr key={index}>
              {/**
               * Instead of writing <td>periodStart</td><td>periodEnd</td> here
               * and then letting GlobalReportsRecordItem return several <td> for each report
               * (which caused duplication), we simply render a single <GlobalReportsRecordItem>
               * that returns exactly one <td> per column, using group.periodStart, group.periodEnd, and group.reports[].
               */}
              <GlobalReportsRecordItem
                currentReports={currentReports}
                groupReports={group.reports}
                periodStart={group.periodStart}
                periodEnd={group.periodEnd}
                dateMode={dateMode}
              />
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
