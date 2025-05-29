import { Table } from 'react-bootstrap';
import { mockDailyReports } from '../mockData';
import {
  filterReportsBeforeDate,
  filterReportsByPeriod,
  getAvarageOfDeath,
  getAvarageOfFoodPercentage,
  getCheckenAmountBefore,
  getEndDate,
  getPreviousCumulative,
  getPreviousReportByFarm,
  getStartDate,
  totalize,
} from '../utils';
import { useSelectedFarmContext } from '../contexts';
import type { FilterDateMod } from '../models';

export default function GlobalReportTable(props: { dateMode: FilterDateMod }) {
  const selectedFarm = useSelectedFarmContext()[0];
  const currentReports = mockDailyReports.filter(
    (report) => report.farm === selectedFarm
  );
  const previousReport = getPreviousReportByFarm(
    currentReports,
    selectedFarm || '',
    new Date()
  );

  console.log(filterReportsByPeriod(currentReports, props.dateMode));

  return (
    <div>
      <Table responsive striped bordered hover>
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
            <td>
              {
                totalize(
                  filterReportsByPeriod(currentReports, props.dateMode),
                  'production'
                ).amount
              }
            </td>
            <td>
              {
                totalize(
                  filterReportsByPeriod(currentReports, props.dateMode),
                  'sale'
                ).amount
              }
            </td>
            <td>
              {filterReportsByPeriod(currentReports, props.dateMode)
                ? getPreviousCumulative(
                    filterReportsByPeriod(currentReports, 'day')[0],
                    filterReportsBeforeDate(currentReports, new Date())
                  )
                : 0}
            </td>
            <td>
              {getCheckenAmountBefore(
                filterReportsByPeriod(currentReports, props.dateMode)[0] ||
                  previousReport,
                undefined,
                currentReports
              )}
            </td>
            <td>
              {
                totalize(
                  filterReportsByPeriod(currentReports, props.dateMode),
                  'death'
                ).amount
              }
            </td>
            <td>
              {getCheckenAmountBefore(
                filterReportsByPeriod(currentReports, props.dateMode)[
                  props.dateMode == 'day'
                    ? 0
                    : filterReportsByPeriod(currentReports, props.dateMode)
                        .length - 1
                ] || previousReport,
                undefined,
                currentReports
              ) -
                totalize(filterReportsByPeriod(currentReports, 'day'), 'death')
                  .amount}
            </td>
            <td>
              {getAvarageOfDeath(
                filterReportsByPeriod(currentReports, props.dateMode),
                props.dateMode
              )}
            </td>
            <td>
              {
                totalize(
                  filterReportsByPeriod(currentReports, props.dateMode),
                  'dailyFood'
                ).amount
              }
            </td>
            {/* Convert this to props when refactor the component */}
            <td>
              {props.dateMode == 'day' ? 1 : props.dateMode == 'week' ? 7 : 30}
            </td>

            <td>
              {getAvarageOfFoodPercentage(
                filterReportsByPeriod(currentReports, props.dateMode),
                props.dateMode,
                'food'
              )}
            </td>
            <td>
              {getAvarageOfFoodPercentage(
                filterReportsBeforeDate(currentReports, new Date(), true),
                props.dateMode,
                'production'
              )}
            </td>

            <td>
              {
                totalize(
                  filterReportsByPeriod(currentReports, props.dateMode),
                  'darkMeat'
                ).amount
              }
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
