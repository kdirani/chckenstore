import FarmsFilter from '../components/FarmsFilter';
import GlobalReportTable from '../components/GlobalReportTable';

export default function GlobalReports() {
  return (
    <div>
      <FarmsFilter></FarmsFilter>
      <h1>تقرير الإنتاج اليومي الشامل</h1>
      <GlobalReportTable dateMode="day" />
      <br />
      <GlobalReportTable dateMode="week" />
      <br />
      <GlobalReportTable dateMode="month" />
    </div>
  );
}
