import { useState, type FormEvent } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import type { InvoiceTypes, IInvoice } from '../models';
import { useFarms } from '../contexts';
import { invoiceService } from '../lib/appwrite';

export interface InvoiceItem {
  meterial: string;
  unit: string;
  amount: number;
  price: number;
  files?: FileList | null;
}

export default function InvoicesForm() {
  const { farms } = useFarms();

  // حقول رئيسية
  const [type, setType] = useState<InvoiceTypes>('Sale');
  const [index, setIndex] = useState<number | ''>('');
  const [farm, setFarm] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customer, setCustomer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // عناصر الفاتورة مع ملفات لكل عنصر
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { meterial: '', unit: '', amount: 0, price: 0, files: null },
  ]);

  // تغيير بيانات عنصر
  const handleItemChange = (
    idx: number,
    field: keyof InvoiceItem,
    value: string | FileList | null
  ) => {
    const updated = [...invoiceItems];
    if (field === 'amount' || field === 'price') {
      updated[idx][field] = Number(value as string);
    } else if (field === 'files') {
      updated[idx].files = value as FileList;
    } else {
      updated[idx][field] = value as string;
    }
    setInvoiceItems(updated);
  };

  const handleAddItem = () =>
    setInvoiceItems([
      ...invoiceItems,
      { meterial: '', unit: '', amount: 0, price: 0, files: null },
    ]);
  const handleRemoveItem = (idx: number) => {
    if (invoiceItems.length === 1) return;
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  // تعبئة وهمية
  const handleAutoFill = () => {
    if (!farms.length) {
      alert('لا توجد مزارع متاحة');
      return;
    }
    const farmId = farms[0].$id;
    const now = new Date();
    setType('Sale');
    setIndex(12345);
    setFarm(farmId);
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().split(' ')[0]);
    setCustomer('عميل تجريبي');
    setInvoiceItems([
      { meterial: 'بيض', unit: 'صندوق', amount: 10, price: 15, files: null },
      { meterial: 'دجاج', unit: 'كيلو', amount: 5, price: 20, files: null },
    ]);
  };

  // إرسال الفاتورة
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // تحقق من الحقول الأساسية
    if (
      index === '' ||
      !farm ||
      !date ||
      !time ||
      !customer ||
      invoiceItems.some(
        (it) =>
          !it.meterial.trim() ||
          !it.unit.trim() ||
          it.amount <= 0 ||
          it.price <= 0
      )
    ) {
      alert('يرجى تعبئة جميع الحقول والتحقق من صحة عناصر الفاتورة');
      setIsSubmitting(false);
      return;
    }

    try {
      // لكل عنصر، أنشئ فاتورة مع ملفاته
      const promises = invoiceItems.map((item) => {
        const invoiceData: IInvoice = {
          type,
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
        const filesArray = item.files ? Array.from(item.files) : [];
        return new Promise<void>((resolve, reject) => {
          invoiceService.create(
            invoiceData,
            filesArray,
            () => resolve(),
            () => reject()
          );
        });
      });

      await Promise.all(promises);
      alert('تم حفظ الفواتير بنجاح');
      // إعادة التهيئة
      setType('Sale');
      setIndex('');
      setFarm('');
      setDate('');
      setTime('');
      setCustomer('');
      setInvoiceItems([
        { meterial: '', unit: '', amount: 0, price: 0, files: null },
      ]);
    } catch {
      alert('حدث خطأ أثناء حفظ الفواتير');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* حقول الأعلى */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
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
          <Form.Group>
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
          <Form.Group>
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

      <Row className="mb-3">
        <Col>
          <Form.Group>
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
          <Form.Group>
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
          <Form.Group>
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

      {/* عناصر الفاتورة كاملة مع رفع ملفات لكل صف */}
      <div className="mb-3">
        <h5>عناصر الفاتورة</h5>
        {invoiceItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
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
            <Col>
              <Form.Control
                type="file"
                multiple
                onChange={(e) =>
                  handleItemChange(
                    idx,
                    'files',
                    (e.target as HTMLInputElement).files
                  )
                }
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
          disabled={isSubmitting}
        >
          إضافة عنصر
        </Button>
      </div>

      {/* أزرار الإرسال والملء التلقائي */}
      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
        </Button>
        <Button
          variant="warning"
          type="button"
          onClick={handleAutoFill}
          disabled={isSubmitting}
        >
          ملء تلقائي
        </Button>
      </div>
    </Form>
  );
}
