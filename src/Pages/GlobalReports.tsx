import { useEffect, useState } from 'react';
import FarmsFilter from '../components/FarmsFilter';
import GlobalReportTable from '../components/GlobalReportTable';
import { useSelectedFarmContext } from '../contexts';
import { reportsService } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { IDailyReport } from '../models';

export default function GlobalReports() {
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IDailyReport[]>([]);

  useEffect(() => {
    if (!selectedFarm) return;

    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert('Error in reports fetch'),
        [Query.equal('farmId', selectedFarm)]
      );
    };
    init();
  }, [selectedFarm]);

  return (
    <div>
      <FarmsFilter></FarmsFilter>
      <h1>تقرير الإنتاج اليومي الشامل</h1>
      <GlobalReportTable dateMode="day" reports={reports} />
      <br />
      <GlobalReportTable dateMode="week" reports={reports} />
      <br />
      <GlobalReportTable dateMode="month" reports={reports} />
    </div>
  );
}
