import { Form, Table } from 'react-bootstrap';
import FarmsFilter from '../components/FarmsFilter';
import { useFarms, useSelectedFarmContext } from '../contexts';
import { useEffect, useState } from 'react';
import type { IInvoice, InvoiceTypes, IRecursiveInvoice } from '../models';
import { invoiceService } from '../lib/appwrite';
import { Query } from 'appwrite';

export default function InvoiceRecord() {
  const selectedFarm = useSelectedFarmContext()[0];
  const farms = useFarms().farms;
  const [type, setType] = useState<InvoiceTypes>('Sale');
  const [invoices, setInvoices] = useState<IRecursiveInvoice[]>([]);
  useEffect(() => {
    if (!selectedFarm) return;
    console.log(selectedFarm);

    const init = async () => {
      invoiceService.list(
        (docs) => setInvoices(docs),
        () => alert('Error in reports fetch'),
        [Query.equal('farmId', selectedFarm || ''), Query.equal('type', type)]
      );
    };
    init();
  }, [selectedFarm, type]);
  console.log(invoiceService);
  return (
    <div>
      <h1>الفواتير</h1>
      <FarmsFilter></FarmsFilter>
      <Form.Group>
        <Form.Select
          onChange={(e) => setType(e.target.value as InvoiceTypes)}
          value={type}
        >
          <option value="Sale">مبيع</option>
          <option value="DarkMeet">سواد</option>
          <option value="Medicine">دواء</option>
        </Form.Select>
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>رقم تقرير الإدخال</th>
            <th>الرقم التسلسلي</th>
            <th>التاريخ</th>
            <th>التوقيت</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>المبلغ</th>
            <th>الوحدة</th>
            <th>{type === 'Medicine' ? 'المادة' : 'الوزن'}</th>
            <th>الزبون</th>
            <th>التوثيق</th>
          </tr>
        </thead>
        <tbody>
          {invoices &&
            invoices.length > 0 &&
            invoices.map((invoice, index) => (
              <TableRow
                key={index + invoice.time}
                invoiceType={type}
                invoice={invoice}
                index={index}
                farmName={
                  farms.find((f) => f.$id === invoice.farmId)?.name ||
                  'غير معروف'
                }
              />
            ))}
        </tbody>
      </Table>
    </div>
  );
}

function TableRow(props: {
  invoiceType: InvoiceTypes;
  invoice: IInvoice;
  index: number;
  farmName: string;
}) {
  const item = props.invoice;
  return (
    <>
      <tr>
        <td>{item.index}</td>
        <td>{props.index}</td>
        <td>{item.date}</td>
        <td>{item.time}</td>
        <td>{item.amount}</td>
        <td>{item.price}</td>
        <td>{item.price * item.amount}</td>
        <td>{item.unit}</td>
        <td>{item.meterial}</td>
        <td>{item.type === 'Medicine' ? props.farmName : item.customer}</td>
      </tr>
    </>
  );
}
