import type { IInvoice } from "./models";

export const mockInvoices: IInvoice[] = [
  {
    type: 'Sale',
    index: 1,
    farm: '1',
    date: '2025-06-04',
    time: '14:30',
    customer: 'محمد الأحمد',
    meterial: '1950/2000',
    unit: 'صندوق',
    amount: 100,
    price: 25
  },
  {
    type: 'DarkMeet',
    index: 2,
    farm: '2',
    date: '2025-06-04',
    time: '15:45',
    customer: 'وليد محمد يد',
    meterial: '0',
    unit: 'متر',
    amount: 50,
    price: 30
  },
  {
    type: 'Medicine',
    index: 3,
    farm: '1',
    date: '2025-06-04',
    time: '16:15',
    customer: '1',
    meterial: 'لقاح كلون 5000',
    unit: 'قطعة',
    amount: 10,
    price: 15
  }
];
