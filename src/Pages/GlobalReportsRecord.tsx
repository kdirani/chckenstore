import { Form, Table } from 'react-bootstrap';
import FarmsFilter from '../components/FarmsFilter';
import { useSelectedFarmContext } from '../contexts';
import { useEffect, useMemo, useState } from 'react';
import type { FilterDateMod, IDailyReport } from '../models';
import { groupReportsByPeriod } from '../utils';
import GlobalReportsRecordItem from '../components/GlobalReportsRecordItem';
import { reportsService } from '../lib/appwrite';
import { Query } from 'appwrite';

export default function GlobalReportsRecord() {
  const [dateMode, setDateMode] = useState<FilterDateMod>('day');
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IDailyReport[]>([]);
  useEffect(() => {
    if (!selectedFarm) return;
    console.log(selectedFarm);

    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert('Error in reports fetch'),
        [Query.equal('farmId', selectedFarm || '')]
      );
    };
    init();
  }, [selectedFarm]);
  console.log(reports);

  // Group them by day/week/month
  const groupedReports = useMemo(() => {
    if (!reports || reports.length === 0) {
      return [];
    }
    return groupReportsByPeriod(reports, dateMode);
  }, [reports, dateMode]);

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
          {reports && reports.length > 0 ? (
            groupedReports.map((group, index) => (
              <tr key={index}>
                {/**
                 * Instead of writing <td>periodStart</td><td>periodEnd</td> here
                 * and then letting GlobalReportsRecordItem return several <td> for each report
                 * (which caused duplication), we simply render a single <GlobalReportsRecordItem>
                 * that returns exactly one <td> per column, using group.periodStart, group.periodEnd, and group.reports[].
                 */}
                <GlobalReportsRecordItem
                  currentReports={reports}
                  groupReports={group.reports}
                  periodStart={group.periodStart}
                  periodEnd={group.periodEnd}
                  dateMode={dateMode}
                />
              </tr>
            ))
          ) : (
            <tr>
              <td>لا توجد تقارير متاحة</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
