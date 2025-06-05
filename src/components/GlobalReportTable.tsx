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

  const startDate = getStartDate(new Date(), props.dateMode);
  const endDate = getEndDate(new Date(), props.dateMode);
  const previousCumulative = previousReport
    ? getPreviousCumulative(
        previousReport,
        filterReportsBeforeDate(currentReports, startDate)
      )
    : 0;
  const totalProduction = totalize(filteredReports, 'production').amount;
  const totalSales = totalize(filteredReports, 'sale').amount;
  const currentCumulative = getPreviousCumulative(
    filteredReports[filteredReports.length - 1],
    filterReportsBeforeDate(currentReports, endDate)
  );
  const startingChickenCount = getCheckenAmountBefore(
    filteredReports[0],
    undefined,
    currentReports
  );
  const totalDeaths = totalize(filteredReports, 'death').amount;
  const endingChickenCount = startingChickenCount - totalDeaths;
  const avgDeath = getAvarageOfDeath(filteredReports, props.dateMode);
  const totalFood = totalize(filteredReports, 'dailyFood').amount;
  const daysInPeriod =
    props.dateMode === 'day' ? 1 : props.dateMode === 'week' ? 7 : 30;
  const avgFoodPerChicken = getAvarageOfFoodProductionPercentage(
    filteredReports,
    props.dateMode,
    'food'
  );
  const avgEggProduction = getAvarageOfFoodProductionPercentage(
    filteredReports,
    props.dateMode,
    'production'
  );
  const totalDarkMeat = totalize(filteredReports, 'darkMeat').amount;

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
            <th>متوسط إنتاج البيض</th>
            <th>كمية السواد المنتج</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{startDate.toLocaleDateString()}</td>
            <td>{endDate.toLocaleDateString()}</td>
            <td>{previousCumulative}</td>
            <td>{totalProduction}</td>
            <td>{totalSales}</td>
            <td>{currentCumulative}</td>
            <td>{startingChickenCount}</td>
            <td>{totalDeaths}</td>
            <td>{endingChickenCount}</td>
            <td>{avgDeath}</td>
            <td>{totalFood}</td>
            <td>{daysInPeriod}</td>
            <td>{avgFoodPerChicken}</td>
            <td>{avgEggProduction}</td>
            <td>{totalDarkMeat}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
