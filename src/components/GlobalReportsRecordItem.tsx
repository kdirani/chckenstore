import type { ReactElement } from 'react';
import type { FilterDateMod, IDailyReport } from '../models';
import { useFarms } from '../contexts';
import {
  filterReportsBeforeDate,
  getAvarageOfDeath,
  getAvarageOfFoodProductionPercentage,
  getCheckenAmountBefore,
  getPreviousCumulative,
  getPreviousReportByFarm,
  totalize,
} from '../utils';

export default function GlobalReportsRecordItem(props: {
  currentReports: IDailyReport[];
  groupReports: IDailyReport[];
  periodStart: Date;
  periodEnd: Date;
  dateMode: FilterDateMod;
}): ReactElement {
  const { currentReports, groupReports, periodStart, periodEnd, dateMode } =
    props;
  const { farms } = useFarms();
  function getPreviousReport(date: Date) {
    return getPreviousReportByFarm(
      currentReports,
      groupReports[0].farmId || '',
      date
    );
  }
  const prevReport = getPreviousReport(periodStart);
  const cumulativePrevious = prevReport
    ? getPreviousCumulative(
        prevReport,
        filterReportsBeforeDate(currentReports, periodStart)
      )
    : 0;
  const totalProduction = totalize(groupReports, 'production').amount;

  // 3) Sum "sale" over the entire group
  const totalSales = totalize(groupReports, 'sale').amount;

  // 4) For "current cumulative," we want the cumulative on the last report in this group.
  //    If it's a "day" group, groupReports only has one report (so it's that report).
  const lastReportInGroup = groupReports[
    groupReports.length - 1
  ] as IDailyReport;
  const allBeforeLast = filterReportsBeforeDate(
    currentReports,
    new Date(lastReportInGroup.date)
  );
  const currentCumulative = getPreviousCumulative(
    lastReportInGroup,
    allBeforeLast
  );

  // 5) "Starting chicken count" = getCheckenAmountBefore for the first day in this group
  const firstReportInGroup = groupReports[0];
  const startingChickenCount = getCheckenAmountBefore(
    firstReportInGroup,
    undefined,
    filterReportsBeforeDate(currentReports, new Date(firstReportInGroup.date)),
    farms
  );

  // 6) "Deaths within the period" = totalize the "death" field in groupReports
  const totalDeaths = totalize(groupReports, 'death').amount;

  // 7) "Ending chicken count" = startingChickenCount – totalDeaths
  const endingChickenCount = startingChickenCount - totalDeaths;

  // 8) "Average death" over the period
  const avgDeath = getAvarageOfDeath(groupReports, dateMode);

  // 9) "Total dailyFood" in the period
  const totalFood = totalize(groupReports, 'dailyFood').amount;

  // 10) "Number of days in period"
  //     - If dateMode='day', that's 1
  //     - If 'week', that's 7
  //     - If 'month', let's compute number of calendar days between periodStart and periodEnd.
  let daysInPeriod: number;
  if (dateMode === 'day') {
    daysInPeriod = 1;
  } else if (dateMode === 'week') {
    daysInPeriod = 7;
  } else {
    // dateMode === "month"
    const startMs = periodStart.getTime();
    const endMs = periodEnd.getTime();
    daysInPeriod = Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
  }

  // 11) "Average food consumption per chicken"
  const avgFoodPerChicken = getAvarageOfFoodProductionPercentage(
    groupReports,
    dateMode,
    'food',
    farms
  );

  // 12) "Total darkMeat" in the period
  const totalDarkMeat = totalize(groupReports, 'darkMeat').amount;

  // 13) "Average egg production" in the period
  const avgEggProd = getAvarageOfFoodProductionPercentage(
    groupReports,
    dateMode,
    'production',
    farms
  );

  return (
    <>
      {/* periodStart */}
      <td>{periodStart.toLocaleDateString()}</td>

      {/* periodEnd */}
      <td>{periodEnd.toLocaleDateString()}</td>

      {/* cumulative previous */}
      <td>{cumulativePrevious}</td>

      {/* total production in this period */}
      <td>{totalProduction}</td>

      {/* total sales in this period */}
      <td>{totalSales}</td>

      {/* cumulative current (as of last day of this period) */}
      <td>{currentCumulative}</td>

      {/* starting chicken count at periodStart */}
      <td>{startingChickenCount}</td>

      {/* total deaths in this period */}
      <td>{totalDeaths}</td>

      {/* ending chicken count */}
      <td>{endingChickenCount}</td>

      {/* average death over period */}
      <td>{avgDeath}</td>

      {/* total dailyFood in this period */}
      <td>{totalFood}</td>

      {/* number of days in the period */}
      <td>{daysInPeriod}</td>

      {/* avg food consumption per chicken */}
      <td>{avgFoodPerChicken}</td>

      {/* total darkMeat in this period */}
      <td>{totalDarkMeat}</td>

      {/* avg egg production in this period */}
      <td>{avgEggProd}</td>
    </>
  );
}
