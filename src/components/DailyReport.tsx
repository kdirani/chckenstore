import DailyReportItem from "./DailyReportItem";

export default function DailyReport() {
  return (
    <div>
      <h1>التقرير الإنتاج اليومي</h1>
      <table border={1}>
        <thead>
          <tr>
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
          <DailyReportItem />
        </tbody>
      </table>
    </div>
  )
}