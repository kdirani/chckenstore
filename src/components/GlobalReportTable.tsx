import { Table } from 'react-bootstrap';
import {
  filterReportsBeforeDate,
  filterReportsByPeriod,
  getAvarageOfDeath,
  getAvarageOfFoodProductionPercentage,
  getCheckenAmountBefore,
  getEndDate,
  getPreviousCumulative,
  getPreviousReportByFarm,
  getStartDate,
  totalize,
} from '../utils';
import { useSelectedFarmContext } from '../contexts';
import type { FilterDateMod, IDailyReport } from '../models';

export default function GlobalReportTable(props: {
  dateMode: FilterDateMod;
  reports: IDailyReport[];
}) {
  const selectedFarm = useSelectedFarmContext()[0];
  const currentReports = props.reports.filter(
    (report) => report.farmId === selectedFarm
  );
  const previousReport = getPreviousReportByFarm(
    currentReports,
    selectedFarm || '',
    new Date()
  );

  if (!currentReports || currentReports.length === 0) {
    return <div>لا توجد تقارير متاحة</div>;
  }

  const filteredReports = filterReportsByPeriod(currentReports, props.dateMode);
  if (!filteredReports || filteredReports.length === 0) {
    return <div>لا توجد تقارير متاحة للفترة المحددة</div>;
  }

  return (
    <div>
      <h2>
        {props.dateMode === 'day'
          ? 'تقرير يومي'
          : props.dateMode === 'week'
          ? 'تقرير أسبوعي'
          : 'تقرير شهري'}
      </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>تاريخ البداية</th>
            <th>تاريخ النهاية</th>
            <th>التراكمي السابق</th>
            <th>الإنتاج الكلي</th>
            <th>المبيعات</th>
            <th>التراكمي الحالي</th>
            <th>عدد الفراخ في البداية</th>
            <th>عدد الفراخ في النهاية</th>
            <th>متوسط النفوق</th>
            <th>العلف</th>
            <th>عدد الأيام</th>
            <th>متوسط استهلاك العلف</th>
            <th>متوسط إنتاج البيض</th>
            <th>السواد</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {getStartDate(new Date(), props.dateMode).toLocaleDateString()}
            </td>
            <td>
              {getEndDate(new Date(), props.dateMode).toLocaleDateString()}
            </td>
            <td>
              {previousReport
                ? getPreviousCumulative(
                    previousReport,
                    filterReportsBeforeDate(currentReports, new Date())
                  )
                : 0}
            </td>
            <td>{totalize(filteredReports, 'production').amount}</td>
            <td>{totalize(filteredReports, 'sale').amount}</td>
            <td>
              {filteredReports.length > 0
                ? getPreviousCumulative(
                    filteredReports[0],
                    filterReportsBeforeDate(currentReports, new Date())
                  )
                : 0}
            </td>
            <td>
              {getCheckenAmountBefore(
                filteredReports[0] || previousReport,
                undefined,
                currentReports
              )}
            </td>
            <td>{totalize(filteredReports, 'death').amount}</td>
            <td>
              {getCheckenAmountBefore(
                filteredReports[filteredReports.length - 1] || previousReport,
                undefined,
                currentReports
              ) - totalize(filteredReports, 'death').amount}
            </td>
            <td>{getAvarageOfDeath(filteredReports, props.dateMode)}</td>
            <td>{totalize(filteredReports, 'dailyFood').amount}</td>
            <td>
              {props.dateMode == 'day' ? 1 : props.dateMode == 'week' ? 7 : 30}
            </td>
            <td>
              {getAvarageOfFoodProductionPercentage(
                filteredReports,
                props.dateMode,
                'food'
              )}
            </td>
            <td>
              {getAvarageOfFoodProductionPercentage(
                filteredReports,
                props.dateMode,
                'production'
              )}
            </td>
            <td>{totalize(filteredReports, 'darkMeat').amount}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
