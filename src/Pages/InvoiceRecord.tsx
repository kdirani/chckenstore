import { Form, Table } from "react-bootstrap";
import FarmsFilter from "../components/FarmsFilter";
import { useSelectedFarmContext } from "../contexts";
import { useState } from "react";
import type { IInvoice, InoviceTypes } from "../models";
import { mockInvoices } from "../invoiceMockData";

export default function InvoiceRecord() {
  const selectedFarm = useSelectedFarmContext()[0];
  const [type, setType] = useState<InoviceTypes>('Sale');
  const currentInvoices = mockInvoices.filter(x => x.type === type && x.farm === selectedFarm);
  return (
    <div>
      <h1>التقرير الإنتاج اليومي</h1>
      <FarmsFilter></FarmsFilter>
      <Form.Group>
        <Form.Select
          onChange={e => setType(e.target.value as InoviceTypes)}
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
          {currentInvoices.map(invoice => 
            <TableRow invoiceType={type} invoice={invoice} />
          )}
        </tbody>
      </Table>
    </div>
  )
}

function TableRow (props: {
  invoiceType: InoviceTypes;
  invoice: IInvoice;
}) {

  return (
    <>
    {props.invoice.data.map((item, index) => 
      <tr>
        <td>{props.invoice.index}</td>
        <td>{index}</td>
        <td>{props.invoice.date}</td>
        <td>{props.invoice.time}</td>
        <td>{item.amount}</td>
        <td>{item.price}</td>
        <td>{item.price * item.amount}</td>
        <td>{item.unit}</td>
        <td>{item.meterial}</td>
        <td>{props.invoiceType === 'Medicine' ? props.invoice.farm : props.invoice.customer}</td>
      </tr>
    )}
    </>
  )
}