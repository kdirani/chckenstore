import { useState } from 'react';
import type { FormEvent } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import type { InvoiceTypes } from '../models';
import { useFarms } from '../contexts';
import { invoiceService } from '../lib/appwrite';

export interface IInvoice {
  types: InvoiceTypes;
  index: number;
  farmId: string;
  date: string;
  time: string;
  customer: string;
  meterial: string;
  unit: string;
  amount: number;
  price: number;
}

export interface InvoiceItem {
  meterial: string;
  unit: string;
  amount: number;
  price: number;
}

export default function InvoicesForm() {
  const { farms } = useFarms();
  const [type, setType] = useState<InvoiceTypes>('Sale');
  const [index, setIndex] = useState<number | ''>('');
  const [farm, setFarm] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customer, setCustomer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { meterial: '', unit: '', amount: 0, price: 0 },
  ]);

  const handleItemChange = (
    idx: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const updated = [...invoiceItems];
    if (field === 'amount' || field === 'price') {
      updated[idx][field] = Number(value);
    } else {
      updated[idx][field] = value;
    }
    setInvoiceItems(updated);
  };

  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { meterial: '', unit: '', amount: 0, price: 0 },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (invoiceItems.length === 1) return;
    const updated = invoiceItems.filter((_, i) => i !== idx);
    setInvoiceItems(updated);
  };

  // دالة الملء التلقائي
  const handleAutoFill = () => {
    if (farms.length === 0) {
      alert('لا توجد مزارع متاحة');
      return;
    }
    // اختيار معرف المزرعة الأولى من المصفوفة
    const farmId = farms[0].$id;
    setType('Sale');
    setIndex(12345);
    setFarm(farmId);
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().split(' ')[0]);
    setCustomer('عميل تجريبي');
    setInvoiceItems([
      {
        meterial: 'بيض',
        unit: 'صندوق',
        amount: 10,
        price: 15,
      },
      {
        meterial: 'دجاج',
        unit: 'كيلو',
        amount: 5,
        price: 20,
      },
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // التحقق من صحة البيانات
    if (
      index === '' ||
      farm.trim() === '' ||
      date.trim() === '' ||
      time.trim() === '' ||
      customer.trim() === ''
    ) {
      alert('يرجى تعبئة جميع الحقول الأساسية');
      setIsSubmitting(false);
      return;
    }

    // التحقق من صحة عناصر الفاتورة
    const invalidItems = invoiceItems.filter(
      (item) =>
        item.meterial.trim() === '' ||
        item.unit.trim() === '' ||
        item.amount <= 0 ||
        item.price <= 0
    );

    if (invalidItems.length > 0) {
      alert('يرجى التأكد من صحة جميع عناصر الفاتورة');
      setIsSubmitting(false);
      return;
    }

    // إنشاء فاتورة لكل عنصر
    const savePromises = invoiceItems.map((item) => {
      const invoiceData: IInvoice = {
        types: type,
        index: Number(index),
        farmId: farm,
        date,
        time,
        customer,
        meterial: item.meterial,
        unit: item.unit,
        amount: item.amount,
        price: item.price,
      };

      return new Promise<void>((resolve, reject) => {
        invoiceService.create(
          invoiceData,
          () => resolve(),
          () => reject()
        );
      });
    });

    // حفظ جميع الفواتير
    Promise.all(savePromises)
      .then(() => {
        alert('تم حفظ الفواتير بنجاح');
        // إعادة تعيين النموذج
        setType('Sale');
        setIndex('');
        setFarm('');
        setDate('');
        setTime('');
        setCustomer('');
        setInvoiceItems([{ meterial: '', unit: '', amount: 0, price: 0 }]);
      })
      .catch(() => {
        alert('حدث خطأ أثناء حفظ الفواتير');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>نوع الفاتورة</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value as InvoiceTypes)}
              disabled={isSubmitting}
            >
              <option value="Sale">مبيع</option>
              <option value="DarkMeet">سواد</option>
              <option value="Medicine">دواء</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>رقم الفاتورة</Form.Label>
            <Form.Control
              type="number"
              value={index}
              onChange={(e) =>
                setIndex(e.target.value === '' ? '' : Number(e.target.value))
              }
              required
              disabled={isSubmitting}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>المزرعة</Form.Label>
            <Form.Select
              value={farm}
              onChange={(e) => setFarm(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">اختر المزرعة</option>
              {farms.map((f) => (
                <option key={f.$id} value={f.$id}>
                  {f.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>التاريخ</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>التوقيت</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>العميل</Form.Label>
            <Form.Control
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mb-3">
        <h4>عناصر الفاتورة</h4>
        {invoiceItems.map((item, idx) => (
          <Row key={idx} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="المادة"
                value={item.meterial}
                onChange={(e) =>
                  handleItemChange(idx, 'meterial', e.target.value)
                }
                required
                disabled={isSubmitting}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="الوحدة"
                value={item.unit}
                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                required
                disabled={isSubmitting}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="الكمية"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(idx, 'amount', e.target.value)
                }
                required
                disabled={isSubmitting}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="السعر"
                value={item.price}
                onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                required
                disabled={isSubmitting}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                onClick={() => handleRemoveItem(idx)}
                disabled={invoiceItems.length === 1 || isSubmitting}
              >
                حذف
              </Button>
            </Col>
          </Row>
        ))}
        <Button
          variant="secondary"
          onClick={handleAddItem}
          className="mt-2"
          disabled={isSubmitting}
        >
          إضافة عنصر
        </Button>
      </div>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleAutoFill}
          disabled={isSubmitting}
        >
          ملء تلقائي بالبيانات الوهمية
        </Button>
      </div>
    </Form>
  );
}
