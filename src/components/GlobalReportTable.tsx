import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
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

interface GlobalReportTableProps {
  dateMode: string;
  reports: any[];
  tableSx?: object; // أضف هذا السطر
}

export default function GlobalReportTable({
  dateMode,
  reports,
  tableSx,
}: GlobalReportTableProps) {
  const selectedFarm = useSelectedFarmContext()[0];
  const currentReports = reports.filter(
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

  const filteredReports = filterReportsByPeriod(currentReports, dateMode);
  if (!filteredReports || filteredReports.length === 0) {
    return <div>لا توجد تقارير متاحة للفترة المحددة</div>;
  }

  const startDate = getStartDate(new Date(), dateMode);
  const endDate = getEndDate(new Date(), dateMode);
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
  const avgDeath = getAvarageOfDeath(filteredReports, dateMode);
  const totalFood = totalize(filteredReports, 'dailyFood').amount;
  const daysInPeriod =
    dateMode === 'day' ? 1 : dateMode === 'week' ? 7 : 30;
  const avgFoodPerChicken = getAvarageOfFoodProductionPercentage(
    filteredReports,
    dateMode,
    'food'
  );
  const avgEggProduction = getAvarageOfFoodProductionPercentage(
    filteredReports,
    dateMode,
    'production'
  );
  const totalDarkMeat = totalize(filteredReports, 'darkMeat').amount;

  return (
    <div style={{ width: '100%', overflowX: 'auto', marginBottom: 24 }}>
      <h2
        style={{
          color: '#c62828',
          fontWeight: 'bold',
          fontSize: 22,
          margin: '16px 0 12px 0',
          textAlign: 'right',
        }}
      >
        {dateMode === 'day'
          ? 'تقرير يومي'
          : dateMode === 'week'
          ? 'تقرير أسبوعي'
          : 'تقرير شهري'}
      </h2>
      <Table
        sx={{
          minWidth: 900,
          borderRadius: 3,
          boxShadow: '0 2px 12px 0 rgba(198,40,40,0.07)',
          '& thead tr': {
            background: '#c62828',
          },
          '& thead th': {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: 13, md: 16 },
            borderBottom: '2px solid #fff',
            textAlign: 'center',
          },
          '& tbody td': {
            textAlign: 'center',
            fontSize: { xs: 12, md: 15 },
          },
          '& tbody tr:nth-of-type(odd)': { backgroundColor: '#fff5f5' },
          '& tbody tr:hover': { backgroundColor: '#ffeaea' },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>تاريخ البداية</TableCell>
            <TableCell>تاريخ النهاية</TableCell>
            <TableCell>الرصيد التراكمي السابق</TableCell>
            <TableCell>كمية الإنتاج</TableCell>
            <TableCell>كمية المبيعات</TableCell>
            <TableCell>الرصيد التراكمي الحالي</TableCell>
            <TableCell>عدد الفرخة بداية الفلترة</TableCell>
            <TableCell>عدد النفوق ضمن فترة الفلترة</TableCell>
            <TableCell>عدد الفرخة نهاية الفلترة</TableCell>
            <TableCell>متوسط النفوق</TableCell>
            <TableCell>كمية العلف المستهلك</TableCell>
            <TableCell>عدد الأيام</TableCell>
            <TableCell>متوسط استهلاك الفرخة من العلف</TableCell>
            <TableCell>متوسط إنتاج البيض</TableCell>
            <TableCell>كمية السواد المنتج</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{startDate.toLocaleDateString()}</TableCell>
            <TableCell>{endDate.toLocaleDateString()}</TableCell>
            <TableCell>{previousCumulative}</TableCell>
            <TableCell>{totalProduction}</TableCell>
            <TableCell>{totalSales}</TableCell>
            <TableCell>{currentCumulative}</TableCell>
            <TableCell>{startingChickenCount}</TableCell>
            <TableCell>{totalDeaths}</TableCell>
            <TableCell>{endingChickenCount}</TableCell>
            <TableCell>{avgDeath}</TableCell>
            <TableCell>{totalFood}</TableCell>
            <TableCell>{daysInPeriod}</TableCell>
            <TableCell>{avgFoodPerChicken}</TableCell>
            <TableCell>{avgEggProduction}</TableCell>
            <TableCell>{totalDarkMeat}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
