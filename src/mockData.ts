import type { IDailyReport } from "./models";

export const mockDailyReports: IDailyReport[] = Array.from({ length: 10 }, (_, i) => ({
  date: `2025-05-${(i + 1).toString().padStart(2, '0')}`,
  time: "10:30",
  farm: "1",
  production: 1000 + i * 50,
  distortedProduction: 30 + i,
  sale: Array.from({ length: 10 }, (_, i) => ({
    amount: i,
    weigh: 70 + i * 2,
    client: `Client ${i + 1}`
  })),
  death: 5 + i,
  dailyFood: 200 + i * 10,
  MonthlyFood: 7000 + i * 100,
  darkMeat: {
    amount: 15 + i,
    unit: "kg",
    client: `Meat Buyer ${i + 1}`
  },
  medicine: Array.from({ length: 10 }, (_, i) => ({
    amount: 2 + i % 3,
    unit: "bottles",
    type: i % 2 === 0 ? "Antibiotics" : "Vitamins",
    stor: `Storage Room ${i % 3 + 1}`
  }))
}));

mockDailyReports.unshift({
  date: "2025-04-02",
  time: "12",
  production: 1200,
  distortedProduction: 100,
  sale: [{
    amount: 300,
    client: '',
    weigh: 0,
  }],
  death: 10,
  dailyFood: 4200,
  darkMeat: {
    amount: 12000,
    client: 'Meat Supplier',
  },
  farm: '1',
  medicine: [{
    amount: 1,
    stor: '',
    type: '',
    unit: '',
  }],
  MonthlyFood: 5,
} as IDailyReport)
