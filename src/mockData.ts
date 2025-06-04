import type { IDailyMedicine, IDailyReport, IDarkMeat, IٍٍDailySale } from "./models";

export const mockDailyReports: IDailyReport[] = (() => {
  const reports: IDailyReport[] = [];
  const farms = ["1", "2"];
  const year = 2025;
  // 4 = May (0-based), 5 = June
  const months: number[] = [4, 5];

  // Helper: format a Date component to "YYYY-MM-DD"
  function formatDateComponent(y: number, m: number, d: number): string {
    const mm = (m + 1).toString().padStart(2, "0");
    const dd = d.toString().padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  // Helper: generate a random integer in [min, max]
  function randBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper: generate a random time string "HH:MM"
  function randomTime(): string {
    const hour = randBetween(6, 18); // between 06 and 18
    const minute = randBetween(0, 59);
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }

  // Helper: random pick from an array
  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  farms.forEach((farmId) => {
    months.forEach((monthIdx) => {
      // Determine how many days in this month
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateComponent(year, monthIdx, day);

        // Randomized fields
        const production = randBetween(800, 1500);
        const distortedProduction = randBetween(5, 50);
        const death = randBetween(1, 10);
        const dailyFood = randBetween(150, 300);
        const MonthlyFood = randBetween(5000, 10000);

        // Generate random sales array (1–5 entries)
        const saleCount = randBetween(1, 5);
        const sale: IٍٍDailySale[] = Array.from(
          { length: saleCount },
          () => ({
            amount: randBetween(1, 20),
            weigh: randBetween(50, 100),
            client: `Client ${randBetween(1, 20)}`,
          })
        );

        // Generate darkMeat entry
        const darkMeat: IDarkMeat = {
          amount: randBetween(5, 25),
          client: `Meat Buyer ${randBetween(1, 20)}`,
        };

        // Generate random medicines array (1–3 entries)
        const medCount = randBetween(1, 3);
        const medTypes = ["Antibiotics", "Vitamins", "Analgesics"];
        const medicine: IDailyMedicine[] = Array.from(
          { length: medCount },
          () => ({
            amount: randBetween(1, 5),
            unit: "bottles",
            type: pickRandom(medTypes),
            stor: `Storage Room ${randBetween(1, 3)}`,
          })
        );

        // Push the report
        reports.push({
          date: dateStr,
          time: randomTime(),
          farmId: farmId,
          production,
          distortedProduction,
          sale,
          death,
          dailyFood,
          MonthlyFood,
          darkMeat,
          medicine,
        });
      }
    });
  });

  return reports;
})();

// mockDailyReports.unshift({
//   date: "2025-04-02",
//   time: "12",
//   production: 1200,
//   distortedProduction: 100,
//   sale: [{
//     amount: 300,
//     client: '',
//     weigh: 0,
//   }],
//   death: 10,
//   dailyFood: 4200,
//   darkMeat: {
//     amount: 12000,
//     client: 'Meat Supplier',
//   },
//   farm: '1',
//   medicine: [{
//     amount: 1,
//     stor: '',
//     type: '',
//     unit: '',
//   }],
//   MonthlyFood: 5,
// } as IDailyReport)
