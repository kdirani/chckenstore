export interface IDailyReport {
    date: string;
    time: string;
    farm:string;
    production: IDataAmount;
    distortedProduction: IDataAmount;
    sale:IٍٍDailySale[];
    death: IDataAmount;
    dailyFood: IDataAmount;
    MonthlyFood: IDataAmount;
    darkMeat: IDarkMeat;
    medicine: IDailyMedicine[];
}

export interface IٍٍDailySale {
    amount:number;
    unit:string;
    weigh:number;
    client :string;

}
export interface IDarkMeat{
    amount: number;
    unit: string;
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