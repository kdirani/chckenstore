import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import type { InvoiceTypes } from "../models";

export interface IInvoice {
  type: InvoiceTypes;
  index: number;
  farm: string;
  date: string;
  time: string;
  customer: string;
  meterial: string;
  unit: string;
  amount: number;
  price: number;
}

interface InvoiceItem {
  meterial: string;
  unit: string;
  amount: number;
  price: number;
}

export default function InvoicesForm() {
  const [type, setType] = useState<InvoiceTypes>("Sale"); 
  const [index, setIndex] = useState<number | "">("");
  const [farm, setFarm] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { meterial: "", unit: "", amount: 0, price: 0 },
  ]);

  const handleItemChange = (
    idx: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const updated = [...invoiceItems];
    if (field === "amount" || field === "price") {
      updated[idx][field] = Number(value);
    } else {
      updated[idx][field] = value;
    }
    setInvoiceItems(updated);
  };

  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { meterial: "", unit: "", amount: 0, price: 0 },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (invoiceItems.length === 1) return;
    const updated = invoiceItems.filter((_, i) => i !== idx);
    setInvoiceItems(updated);
  };

  // دالة الملء التلقائي
  const handleAutoFill = () => {
    setType("Sale"); // مثال لقيمة من InvoiceTypes
    setIndex(123);
    setFarm("farm-xyz");
    setDate("2025-06-04");
    setTime("14:45");
    setCustomer("عميل تجريبي");

    setInvoiceItems([
      { meterial: "ذرة", unit: "كغم", amount: 100, price: 2.5 },
      { meterial: "شعير", unit: "كغم", amount: 50, price: 3.0 },
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      index === "" ||
      farm.trim() === "" ||
      date.trim() === "" ||
      time.trim() === "" ||
      customer.trim() === ""
    ) {
      alert(
        "يرجى تعبئة جميع الحقول الأساسية (النوع، الرقم، المزرعة، التاريخ، الوقت، العميل)."
      );
      return;
    }

    invoiceItems.forEach((item) => {
      const invoiceDoc: IInvoice = {
        type,
        index: Number(index),
        farm,
        date,
        time,
        customer,
        meterial: item.meterial,
        unit: item.unit,
        amount: item.amount,
        price: item.price,
      };

      console.log("إنشاء فاتورة جديدة:", invoiceDoc);
      // createDocument("invoices_collection_id", invoiceDoc, (newId) => {}, () => {});
    });

    // إعادة تعيين الحقول
    setType("" as InvoiceTypes);
    setIndex("");
    setFarm("");
    setDate("");
    setTime("");
    setCustomer("");
    setInvoiceItems([{ meterial: "", unit: "", amount: 0, price: 0 }]);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* زر الملء التلقائي */}
      <Button
        variant="warning"
        type="button"
        className="mb-3"
        onClick={handleAutoFill}
      >
        ملء تلقائي بالبيانات الوهمية
      </Button>

      {/* نوع الفاتورة */}
      <Form.Group controlId="invoiceType" className="mb-3">
        <Form.Label>نوع الفاتورة</Form.Label>
        <Form.Select
          value={type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setType(e.target.value as InvoiceTypes)
          }
          required
        >
          <option value="">اختر النوع</option>
          {/* تأكد من تعديل القيم حسب InvoiceTypes الحقيقية */}
          <option value="SALE">بيع</option>
          <option value="PURCHASE">شراء</option>
        </Form.Select>
      </Form.Group>

      {/* رقم الفاتورة */}
      <Form.Group controlId="invoiceIndex" className="mb-3">
        <Form.Label>رقم الفاتورة</Form.Label>
        <Form.Control
          type="number"
          value={index}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setIndex(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="أدخل رقم الفاتورة"
          required
        />
      </Form.Group>

      {/* معرّف المزرعة */}
      <Form.Group controlId="invoiceFarm" className="mb-3">
        <Form.Label>المزرعة</Form.Label>
        <Form.Control
          type="text"
          value={farm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFarm(e.target.value)}
          placeholder="أدخل اسم المزرعة أو معرّفها"
          required
        />
      </Form.Group>

      {/* التاريخ */}
      <Form.Group controlId="invoiceDate" className="mb-3">
        <Form.Label>التاريخ</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          required
        />
      </Form.Group>

      {/* الوقت */}
      <Form.Group controlId="invoiceTime" className="mb-3">
        <Form.Label>الوقت</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
          required
        />
      </Form.Group>

      {/* العميل */}
      <Form.Group controlId="invoiceCustomer" className="mb-3">
        <Form.Label>العميل</Form.Label>
        <Form.Control
          type="text"
          value={customer}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
          placeholder="أدخل اسم العميل"
          required
        />
      </Form.Group>

      {/* قسم البنود الديناميكي */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">
          البنود (المادة، الوحدة، الكمية، السعر)
        </legend>
        {invoiceItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col md={3}>
              <Form.Group controlId={`item-meterial-${idx}`}>
                <Form.Label>المادة</Form.Label>
                <Form.Control
                  type="text"
                  value={item.meterial}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(idx, "meterial", e.target.value)
                  }
                  placeholder="مثلاً: ذرة"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`item-unit-${idx}`}>
                <Form.Label>الوحدة</Form.Label>
                <Form.Control
                  type="text"
                  value={item.unit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(idx, "unit", e.target.value)
                  }
                  placeholder="مثلاً: كغم"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId={`item-amount-${idx}`}>
                <Form.Label>الكمية</Form.Label>
                <Form.Control
                  type="number"
                  value={item.amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(idx, "amount", e.target.value)
                  }
                  placeholder="مثلاً: 100"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId={`item-price-${idx}`}>
                <Form.Label>السعر</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(idx, "price", e.target.value)
                  }
                  placeholder="مثلاً: 2.50"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="danger"
                onClick={() => handleRemoveItem(idx)}
                disabled={invoiceItems.length === 1}
                title="إزالة هذا الصف"
              >
                إزالة
              </Button>
            </Col>
          </Row>
        ))}

        <Button variant="secondary" onClick={handleAddItem}>
          إضافة بند جديد
        </Button>
      </fieldset>

      {/* زر الإرسال */}
      <Button variant="primary" type="submit">
        حفظ الفواتير
      </Button>
    </Form>
  );
}
