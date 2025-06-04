export interface IDailyReport {
    date: string;
    time: string;
    farm:string;
    production: number;
    distortedProduction: number;
    sale:IٍٍDailySale[];
    death: number;
    dailyFood: number;
    MonthlyFood: number;
    darkMeat: IDarkMeat;
    medicine: IDailyMedicine[];
}

export interface IٍٍDailySale {
    amount:number;
    weigh: number;
    client :string;
}
export interface IDarkMeat{
    amount: number;
    client: string;
}

export interface IDailyMedicine {
    amount: number;
    unit: string;
    type: string;
    stor: string;
}

export interface IDataAmount {
    amount: number;
    unit: string;
}

export type FilterDateMod = 'day' | 'week' | 'month';

export interface IGroupedReport { periodStart: Date; periodEnd: Date; reports: IDailyReport[] };

export type InoviceTypes = 'Sale' | 'DarkMeet' | 'Medicine'

export interface IInvoice {
  type: InoviceTypes;
  index: number;
  farm: string;
  date: string;
  time: string;
  customer: string;
  data: IInvoiceData[];
}

export interface IInvoiceData {
  meterial: string;
  unit: string;
  amount: number;
  price: number;
}