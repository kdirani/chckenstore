import type { IDailyReport, FilterDateMod, IDataAmount } from "./models";

export const  getFoodPercentage = (foodAmount: number, checkensAmount: number) => {
  const foodInG = foodAmount * 1000;
  return (foodInG / checkensAmount).toFixed(2) + '%';
}



export const calculatePercentageAndTotal = (part: number, total: number) => {
  if (total === 0) {
    throw new Error('Total cannot be zero.');
  }

  const percentage = (part / total) * 100;
  return `${parseFloat(percentage.toFixed(2))}%`;
}

export const getPreviousCumulative = (report: IDailyReport, allReports: IDailyReport[]) => {
  const amounts: number[] = [];
  allReports.forEach((item) => {
    const currentDate = new Date(report.date).getTime();
    const itemDate = new Date(item.date).getTime();
    if (itemDate < currentDate) {
      amounts.push(
        item.production +
          item.distortedProduction -
          item.sale.reduce((acc, it) => acc + it.amount, 0)
      );
    }
  });
  const total = amounts.reduce((acc, amount) => acc + amount, 0);
  const finalAmount =
    report.production +
    report.distortedProduction -
    report.sale.reduce((acc, it) => acc + it.amount, 0) +
    total;
  return finalAmount;
};
export const getCheckenAmountBefore = (
  report: IDailyReport,
  init: number = 40000,
  allReports: IDailyReport[]
) => {
  const amounts: number[] = [];
  if (allReports.indexOf(report) === 0) return init;
  allReports.forEach((item) => {
    const currentDate = new Date(report.date).getTime();
    const itemDate = new Date(item.date).getTime();
    if (itemDate < currentDate) {
      amounts.push(item.death);
    }
  });
  const total = amounts.reduce((acc, amount) => acc + amount, 0);
  return init - total;
};

export const getCartorCalc = (report: IDailyReport) => {
  const cartonAmount = report.production / 100;
  const unneededCarton = report.production / 1000;
  return cartonAmount + unneededCarton;
};

export function getStartDate(date: Date, mode: FilterDateMod): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (mode === 'month') {
    d.setDate(1);
    return d;
  }

  if (mode === 'week') {
    const day = d.getDay();      // 0=Sun … 6=Sat
    const diff = (day + 7 - 6) % 7;  // offset from Saturday
    d.setDate(d.getDate() - diff);
    return d;
  }

  // mode === 'day'
  return d;
}

/** 
 * Get the end of the week (Friday), month, or day for a given date. 
 */
export function getEndDate(
  date: Date,
  mode: FilterDateMod
): Date {
  const d = new Date(date);

  if (mode === 'day') {
    // 1) العبور إلى اليوم التالي
    d.setDate(d.getDate() + 1);
  } else if (mode === 'week') {
    // 2) إيجاد نهاية أسبوع (الجمعة)
    const dayOfWeek = d.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    d.setDate(d.getDate() + daysUntilFriday);
  } else if (mode === 'month') {
    // 3) الانتقال إلى نهاية الشهر
    d.setMonth(d.getMonth() + 1, 0);
  }

  // 4) ضبط نهاية اليوم (آخر لحظة)
  d.setHours(23, 59, 59, 999);

  return d;
}

export function getNextDay() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return next;
}


// fix problem of return to days on mode = 'day' and filter by period
export function filterReportsByPeriod(
  reports: IDailyReport[],
  mode: FilterDateMod
): IDailyReport[] {
  const now = new Date();
  const start = getStartDate(now, mode);

  // في حال اليوم: نعيّن نهاية اليوم فقط (بدون إضافة يوم كامل)
  const end = mode === 'day'
    ? (() => {
        const e = new Date(start);
        e.setHours(23, 59, 59, 999);
        return e;
      })()
    : getEndDate(now, mode);

  return reports.filter(r => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });
}


export function filterReportsBeforeDate(
  reports: IDailyReport[],
  referenceDate: Date,
  includeToday = false
): IDailyReport[] {
  // حساب منتصف ليل اليوم المرجعي
  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);

  // إذا includeToday = true، نرفع الحد إلى منتصف ليل اليوم التالي
  const cutoff = includeToday
    ? new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    : startOfDay;

  return reports.filter(r => {
    const reportDate = new Date(r.date);
    // شرط: قبل الحد (strict) حتى لا نعيد تقريرات اليوم عند includeToday=false
    return reportDate < cutoff;
  });
}
export function getPreviousReportByFarm(
  reports: IDailyReport[],
  farmName: string,
  referenceDate: Date
){
  // Build a cutoff at 00:00:00 of referenceDate:
  const cutoff = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(), // day
    0, 0, 0, 0
  ).getTime();

  // Filter to this farm and strictly before cutoff.
  const candidates = reports
    .filter(r => r.farm === farmName)
    .map(r => ({ r, time: new Date(r.date).getTime() }))
    .filter(({ time }) => !isNaN(time) && time < cutoff);

  if (candidates.length === 0) return null;

  // Sort descending by time, then pick the first.
  candidates.sort((a, b) => b.time - a.time);
  return candidates[0].r;
}

export function totalize<K extends keyof IDailyReport>(
  reports: IDailyReport[],
  key: K
): IDataAmount {
  let total = 0;
  let unit = '';

  if (reports.length === 0) {
    return { amount: 0, unit };
  }

  // Peek at first report to decide how to handle the key
  const sample = reports[0][key];

  if (typeof sample === 'number') {
    // Simple numeric sum
    total = reports.reduce((sum, rpt) => sum + (rpt[key] as number), 0);
  } else if (Array.isArray(sample)) {
    // Array of { amount, … }
    // If items also have a `unit` field, we assume all use the same unit
    const arr = sample as any[];
    // grab unit from first item if present
    if (arr.length > 0 && typeof arr[0].unit === 'string') {
      unit = arr[0].unit;
    }
    total = reports.reduce((sum, rpt) => {
      const items = rpt[key] as any[];
      return sum + items.reduce((s, item) => s + (item.amount ?? 0), 0);
    }, 0);
  } else if (
    typeof sample === 'object' &&
    sample !== null &&
    'amount' in (sample as object)
  ) {
    // Single object with amount (like darkMeat)
    total = reports.reduce(
      (sum, rpt) => sum + ((rpt[key] as any).amount ?? 0),
      0
    );
  } else {
    throw new Error(`Cannot totalize key "${String(key)}"`);
  }

  return { amount: total, unit };
}

export function getAvarageOfDeath(reports: IDailyReport[], dateMode: FilterDateMod) {
  let amount = totalize(reports, 'death').amount;
  switch (dateMode) {
    case 'week':
      amount /= 7;
      break;
    case 'month':
      amount /= 30;
      break;
    default:
      break; 
  }
  return amount.toFixed(2);
}

export const  getAvarageOfFoodPercentage = (reports: IDailyReport[], filterDate:FilterDateMod, type:"food" | "production") => {
  let totalPercentage = 0;
  reports.forEach((report) => {

    if (type === 'food') {
      const percentage = getFoodPercentage(report.dailyFood, getCheckenAmountBefore(report, undefined, reports));
      totalPercentage += Number(percentage.replace('%', ''));
      return;
    }

    const percentage = calculatePercentageAndTotal(
              (report.production + report.distortedProduction) * 30,
              getCheckenAmountBefore(report, undefined, reports)
            )
    totalPercentage += Number(percentage.replace('%', ''));
  });
  switch (filterDate) {
    case 'week':
      totalPercentage /= 7;
      break;
    case 'month':
      totalPercentage /= 30; // Approximation
      break;
    default:
      break;      
  }   
  // console.log('totalPercentage', totalPercentage);
  // console.log('reports', reports);
  
  return totalPercentage.toFixed(2) + '%';

}



