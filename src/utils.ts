/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IDailyReport,
  FilterDateMod,
  IDataAmount,
  IGroupedReport,
  IٍٍDailySale,
} from './models';

export const getFoodPercentage = (
  foodAmount: number,
  checkensAmount: number
) => {
  const foodInG = foodAmount * 1000;
  return (foodInG / checkensAmount).toFixed(2) + '%';
};

export const calculatePercentageAndTotal = (part: number, total: number) => {
  if (total === 0) {
    throw new Error('Total cannot be zero.');
  }

  const percentage = (part / total) * 100;
  return `${parseFloat(percentage.toFixed(2))}%`;
};

export const getPreviousCumulative = (
  report: IDailyReport,
  allReports: IDailyReport[]
) => {
  const amounts: number[] = [];
  allReports.forEach((item) => {
    const currentDate = new Date(report.date).getTime();
    const itemDate = new Date(item.date).getTime();
    if (itemDate < currentDate) {
      const sale =
        typeof item.sale === 'string' ? JSON.parse(item.sale) : item.sale;
      amounts.push(
        item.production +
          item.distortedProduction -
          sale.reduce((acc: number, it: IٍٍDailySale) => acc + it.amount, 0)
      );
    }
  });
  const total = amounts.reduce((acc, amount) => acc + amount, 0);
  const sale =
    typeof report.sale === 'string' ? JSON.parse(report.sale) : report.sale;
  const finalAmount =
    report.production +
    report.distortedProduction -
    sale.reduce((acc: number, it: IٍٍDailySale) => acc + it.amount, 0) +
    total;
  return finalAmount;
};
export const getCheckenAmountBefore = (
  report: IDailyReport,
  init: number = 40000,
  allReports: IDailyReport[]
) => {
  const reportIndex = allReports.findIndex(
    (r) => r.date === report.date && r.time === report.time
  );

  if (reportIndex <= 0) {
    return init;
  }

  const previousDeaths = allReports
    .slice(0, reportIndex)
    .reduce((total, r) => total + r.death, 0);

  return init - previousDeaths;
};

export const getInitialCheckenFromFarm = async (farmId: string): Promise<number> => {
  if (!farmId) {
    console.warn('farmId غير محدد، استخدام القيمة الافتراضية');
    return 40000;
  }

  try {
    const { farmsService } = await import('./lib/appwrite');
    return new Promise((resolve) => {
      farmsService.list(
        (farms) => {
          const farm = farms.find((f: any) => f.farmId === farmId || f.$id === farmId);
          if (farm && typeof farm.initialChecken === 'number') {
            console.log(`تم العثور على المزرعة: ${farm.name}, initialChecken: ${farm.initialChecken}`);
            resolve(farm.initialChecken);
          } else {
            console.warn(`لم يتم العثور على المزرعة أو initialChecken غير محدد، استخدام القيمة الافتراضية: 40000`);
            resolve(40000);
          }
        },
        (error) => {
          console.error('خطأ في جلب بيانات المزرعة:', error);
          resolve(40000); // القيمة الافتراضية في حالة الخطأ
        },
        []
      );
    });
  } catch (error) {
    console.error('خطأ في استيراد farmsService:', error);
    return 40000; // القيمة الافتراضية في حالة الخطأ
  }
};

export const getCartorCalc = (report: IDailyReport) => {
  const cartonAmount = report.production / 100;
  const unneededCarton = report.production / 1000;
  return (cartonAmount + unneededCarton).toFixed(2);
};

export function getStartDate(date: Date, mode: FilterDateMod): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (mode === 'month') {
    d.setDate(1);
    return d;
  }

  if (mode === 'week') {
    const day = d.getDay(); // 0=Sun … 6=Sat
    const diff = (day + 7 - 6) % 7; // offset from Saturday
    d.setDate(d.getDate() - diff);
    return d;
  }

  // mode === 'day'
  return d;
}

/**
 * Get the end of the week (Friday), month, or day for a given date.
 */
export function getEndDate(date: Date, mode: FilterDateMod): Date {
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
  if (!reports || reports.length === 0) {
    return [];
  }

  const now = new Date();
  const startDate = getStartDate(now, mode);
  const endDate = getEndDate(startDate, mode);

  return reports.filter((report) => {
    const reportDate = new Date(report.date);
    return reportDate >= startDate && reportDate <= endDate;
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

  return reports.filter((r) => {
    const reportDate = new Date(r.date);
    // شرط: قبل الحد (strict) حتى لا نعيد تقريرات اليوم عند includeToday=false
    return reportDate < cutoff;
  });
}
export function getPreviousReportByFarm(
  reports: IDailyReport[],
  farmName: string,
  referenceDate: Date
) {
  // Build a cutoff at 00:00:00 of referenceDate:
  const cutoff = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(), // day
    0,
    0,
    0,
    0
  ).getTime();

  // Filter to this farm and strictly before cutoff.
  const candidates = reports
    .filter((r) => r.farmId === farmName)
    .map((r) => ({ r, time: new Date(r.date).getTime() }))
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
  } else if (typeof sample === 'string') {
    // Handle JSON string fields
    try {
      const parsedSample = JSON.parse(sample);
      if (Array.isArray(parsedSample)) {
        // Array of { amount, … }
        total = reports.reduce((sum, rpt) => {
          const items = JSON.parse(rpt[key] as string);
          return (
            sum +
            items.reduce((s: number, item: any) => s + (item.amount ?? 0), 0)
          );
        }, 0);
      } else if (
        parsedSample &&
        typeof parsedSample === 'object' &&
        'amount' in parsedSample
      ) {
        // Single object with amount (like darkMeat)
        total = reports.reduce((sum, rpt) => {
          const item = JSON.parse(rpt[key] as string);
          return sum + (item.amount ?? 0);
        }, 0);
      }
    } catch (e) {
      console.error(`Error parsing JSON for key "${String(key)}":`, e);
      return { amount: 0, unit };
    }
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

export function getAvarageOfDeath(
  reports: IDailyReport[],
  dateMode: FilterDateMod
) {
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

export const getAvarageOfFoodProductionPercentage = (
  reports: IDailyReport[],
  filterDate: FilterDateMod,
  type: 'food' | 'production'
) => {
  let totalPercentage = 0;
  reports.forEach((report) => {
    if (type === 'food') {
      const percentage = getFoodPercentage(
        report.dailyFood,
        getCheckenAmountBefore(report, undefined, reports)
      );
      totalPercentage += Number(percentage.replace('%', ''));
      return;
    }

    const percentage = calculatePercentageAndTotal(
      (report.production + report.distortedProduction) * 30,
      getCheckenAmountBefore(report, undefined, reports)
    );
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
};

function getPeriodStart(date: Date, mode: FilterDateMod): Date {
  const d = new Date(date);
  // Zero out time so we are at 00:00:00.000 that day
  d.setHours(0, 0, 0, 0);

  if (mode === 'day') {
    // Simply day@00:00
    return d;
  }

  if (mode === 'month') {
    // Jump to day=1 at 00:00
    d.setDate(1);
    return d;
  }

  // mode === 'week' (Saturday start):
  //   Saturday has getDay() = 6
  const dayOfWeek = d.getDay(); // 0 = Sun … 6 = Sat
  const offsetFromSaturday = (dayOfWeek + 7 - 6) % 7;
  // Subtract offsetFromSaturday days to land on Saturday
  d.setDate(d.getDate() - offsetFromSaturday);
  return d;
}

function getPeriodEnd(periodStart: Date, mode: FilterDateMod): Date {
  const end = new Date(periodStart);

  if (mode === 'day') {
    end.setHours(23, 59, 59, 999);
    return end;
  }

  if (mode === 'week') {
    // periodStart is Saturday@00:00 → add 6 days to get to Friday
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  // mode === 'month'
  // Move to day=0 of next month = last day of current month
  end.setMonth(end.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function groupReportsByPeriod(
  reports: IDailyReport[],
  mode: FilterDateMod
): { periodStart: Date; periodEnd: Date; reports: IDailyReport[] }[] {
  // Use a Map<periodStartTimestamp, IDailyReport[]> to collect groups
  const map = new Map<number, IDailyReport[]>();

  for (const rpt of reports) {
    const rptDate = new Date(rpt.date);
    if (isNaN(rptDate.getTime())) {
      // Skip any invalid dates
      continue;
    }

    const periodStart = getPeriodStart(rptDate, mode);
    const key = periodStart.getTime();

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(rpt);
  }

  // Convert the Map into an array of { periodStart, periodEnd, reports }
  const result: IGroupedReport[] = [];

  for (const [ts, group] of map.entries()) {
    const periodStart = new Date(ts);
    const periodEnd = getPeriodEnd(periodStart, mode);
    result.push({ periodStart, periodEnd, reports: group });
  }

  // Sort by ascending periodStart
  result.sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());
  return result as IGroupedReport[];
}
