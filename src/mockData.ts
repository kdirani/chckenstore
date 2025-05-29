import type { IDailyReport } from "./models";

export const mockDailyReports: IDailyReport[] = Array.from({ length: 10 }, (_, i) => ({
    date: `2025-05-${(i + 1).toString().padStart(2, '0')}`,
    time: "10:30",
    farm: "1",
    production: {
        amount: 1000 + i * 50,
        unit: "eggs"
    },
    distortedProduction: {
        amount: 30 + i,
        unit: "eggs"
    },
    sale: Array.from({ length: 10 }, (_, i) => ({
        amount: i,
        unit: "eggs",
        weigh: 70 + i * 2,
        client: `Client ${i + 1}`
    })),
    death: {
        amount: 5 + i,
        unit: "chickens"
    },
    dailyFood: {
        amount: 200 + i * 10,
        unit: "kg"
    },
    MonthlyFood: {
        amount: 7000 + i * 100,
        unit: "kg"
    },
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
    production: {
        amount: 1200,
        unit: '',
    },
    distortedProduction: {
        amount: 100,
        unit: '',
    },
    sale: [{
        amount: 300,
        unit: '',
        client: '',
        weigh: 0,
    }],
    death: {
        amount: 10,
        unit: '',
    },
    dailyFood: {
        amount: 4200,
        unit: '',
    },
    darkMeat: {
        amount: 12000,
        unit: '',
    },
    farm: '1',
    medicine: [{
        amount: 1,
        stor: '',
        type: '',
        unit: '',
    }],
    MonthlyFood: {
        amount: 5,
        unit: '',
    },
} as IDailyReport)
