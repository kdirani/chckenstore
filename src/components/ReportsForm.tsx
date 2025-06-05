import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { reportsService } from '../lib/appwrite';
import { useFarms } from '../contexts';

interface SaleItem {
  amount: string;
  weigh: string;
  client: string;
}

interface MedicineItem {
  amount: string;
  unit: string;
  type: string;
  stor: string;
}

export default function ReportsForm() {
  const { farms } = useFarms();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [farmId, setFarmId] = useState('');
  const [production, setProduction] = useState('');
  const [distortedProduction, setDistortedProduction] = useState('');
  const [death, setDeath] = useState('');
  const [dailyFood, setDailyFood] = useState('');
  const [monthlyFood, setMonthlyFood] = useState('');

  // في السابق كنا نخزن حقل "darkMeat" ككائن، الآن نريد أن نرسله كسلسلة JSON
  const [darkAmount, setDarkAmount] = useState('');
  const [darkClient, setDarkClient] = useState('');

  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    { amount: '', weigh: '', client: '' },
  ]);

  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([
    { amount: '', unit: '', type: '', stor: '' },
  ]);

  const handleSaleChange = (
    index: number,
    field: keyof SaleItem,
    value: string
  ) => {
    const updated = [...saleItems];
    updated[index][field] = value;
    setSaleItems(updated);
  };

  const handleAddSale = () => {
    setSaleItems([...saleItems, { amount: '', weigh: '', client: '' }]);
  };

  const handleRemoveSale = (index: number) => {
    if (saleItems.length === 1) return;
    const updated = saleItems.filter((_, i) => i !== index);
    setSaleItems(updated);
  };

  const handleMedicineChange = (
    index: number,
    field: keyof MedicineItem,
    value: string
  ) => {
    const updated = [...medicineItems];
    updated[index][field] = value;
    setMedicineItems(updated);
  };

  const handleAddMedicine = () => {
    setMedicineItems([
      ...medicineItems,
      { amount: '', unit: '', type: '', stor: '' },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicineItems.length === 1) return;
    const updated = medicineItems.filter((_, i) => i !== index);
    setMedicineItems(updated);
  };

  // دالة لملء الحقول ببيانات وهمية تلقائيًا
  const handleAutoFill = () => {
    if (!farms || farms.length === 0) {
      alert('لا توجد مزارع متاحة. يرجى إضافة مزرعة أولاً.');
      return;
    }

    // نستخدم معرف المزرعة الأولى من القائمة
    const firstFarmId = farms[0].$id;

    // نستخدم التاريخ الحالي "2025-06-04" والوقت "12:30"
    setDate('2025-06-04');
    setTime('12:30');
    setFarmId(firstFarmId);
    setProduction('1000');
    setDistortedProduction('50');
    setDeath('5');
    setDailyFood('200');
    setMonthlyFood('6000');

    // حقل اللحم الداكن
    setDarkAmount('12000');
    setDarkClient('وليد محمد عيد');

    // مصفوفة المبيعات الوهمية
    setSaleItems([
      { amount: '10', weigh: '5.2', client: 'عميل أول' },
      { amount: '8', weigh: '4.7', client: 'عميل ثاني' },
    ]);

    // مصفوفة الأدوية الوهمية
    setMedicineItems([
      { amount: '2', unit: 'علبة', type: 'مضاد حيوي', stor: 'المخزن الرئيسي' },
      { amount: '5', unit: 'حقنة', type: 'فيتامينات', stor: 'المخزن الجانبي' },
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // تجميع بيانات التقرير اليومي
    const report = {
      date,
      time,
      farmId,
      production: Number(production),
      distortedProduction: Number(distortedProduction),
      sale: JSON.stringify(
        saleItems.map((item) => ({
          amount: Number(item.amount),
          weigh: Number(item.weigh),
          client: item.client,
        }))
      ),
      death: Number(death),
      dailyFood: Number(dailyFood),
      MonthlyFood: Number(monthlyFood),
      // الآن حقل اللحم الداكن يُرسل كسلسلة JSON
      darkMeat: JSON.stringify({
        amount: Number(darkAmount),
        client: darkClient,
      }),
      medicine: JSON.stringify(
        medicineItems.map((item) => ({
          amount: Number(item.amount),
          unit: item.unit,
          type: item.type,
          stor: item.stor,
        }))
      ),
    };

    // يمكنك هنا استدعاء دالة createDocument مع تمرير report
    reportsService.create(
      report,
      (newId) => {
        // عند نجاح الحفظ
        setDate('');
        setTime('');
        setFarmId('');
        setProduction('');
        setDistortedProduction('');
        setDeath('');
        setDailyFood('');
        setMonthlyFood('');
        setDarkAmount('');
        setDarkClient('');
        setSaleItems([{ amount: '', weigh: '', client: '' }]);
        setMedicineItems([{ amount: '', unit: '', type: '', stor: '' }]);
        alert('تم حفظ التقرير بنجاح. المعرف: ' + newId);
      },
      () => {
        alert('حدث خطأ أثناء حفظ التقرير. حاول مرة أخرى.');
      }
    );
    // مثال:
    // createDocument("معرف_المجموعة", report, (newId) => { ... }, () => { ... });
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

      {/* التاريخ */}
      <Form.Group controlId="date" className="mb-3">
        <Form.Label>التاريخ</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDate(e.target.value)
          }
          required
        />
      </Form.Group>

      {/* الوقت */}
      <Form.Group controlId="time" className="mb-3">
        <Form.Label>الوقت</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTime(e.target.value)
          }
          required
        />
      </Form.Group>

      {/* معرّف المزرعة */}
      <Form.Group controlId="farmId" className="mb-3">
        <Form.Label>معرّف المزرعة</Form.Label>
        <Form.Control
          type="text"
          value={farmId}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFarmId(e.target.value)
          }
          placeholder="أدخل معرّف المزرعة"
          required
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          {/* الإنتاج */}
          <Form.Group controlId="production" className="mb-3">
            <Form.Label>الإنتاج</Form.Label>
            <Form.Control
              type="number"
              value={production}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setProduction(e.target.value)
              }
              placeholder="أدخل مقدار الإنتاج"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* الإنتاج المشوّه */}
          <Form.Group controlId="distortedProduction" className="mb-3">
            <Form.Label>الإنتاج المشوّه</Form.Label>
            <Form.Control
              type="number"
              value={distortedProduction}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDistortedProduction(e.target.value)
              }
              placeholder="أدخل مقدار الإنتاج المشوّه"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* قسم المبيعات الديناميكي */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">المبيعات</legend>
        {saleItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col md={3}>
              <Form.Group controlId={`sale-amount-${idx}`}>
                <Form.Label>الكمية</Form.Label>
                <Form.Control
                  type="number"
                  value={item.amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSaleChange(idx, 'amount', e.target.value)
                  }
                  placeholder="مثلاً: 10"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`sale-weigh-${idx}`}>
                <Form.Label>الوزن</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={item.weigh}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSaleChange(idx, 'weigh', e.target.value)
                  }
                  placeholder="مثلاً: 5.2"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId={`sale-client-${idx}`}>
                <Form.Label>العميل</Form.Label>
                <Form.Control
                  type="text"
                  value={item.client}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSaleChange(idx, 'client', e.target.value)
                  }
                  placeholder="أدخل اسم العميل"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="danger"
                onClick={() => handleRemoveSale(idx)}
                disabled={saleItems.length === 1}
                title="إزالة هذا الصف"
              >
                إزالة
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={handleAddSale}>
          إضافة صفقة جديدة
        </Button>
      </fieldset>

      {/* عدد الوفيات */}
      <Form.Group controlId="death" className="mb-3">
        <Form.Label>عدد الوفيات</Form.Label>
        <Form.Control
          type="number"
          value={death}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDeath(e.target.value)
          }
          placeholder="أدخل عدد الوفيات"
          required
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          {/* الطعام اليومي */}
          <Form.Group controlId="dailyFood" className="mb-3">
            <Form.Label>الطعام اليومي</Form.Label>
            <Form.Control
              type="number"
              value={dailyFood}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDailyFood(e.target.value)
              }
              placeholder="أدخل كمية الطعام اليومي"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* الطعام الشهري */}
          <Form.Group controlId="monthlyFood" className="mb-3">
            <Form.Label>الطعام الشهري</Form.Label>
            <Form.Control
              type="number"
              value={monthlyFood}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMonthlyFood(e.target.value)
              }
              placeholder="أدخل كمية الطعام الشهري"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* قسم اللحم الداكن (الآن سنرسل الحقل كسلسلة JSON) */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">اللحم الداكن</legend>
        <Row>
          <Col md={6}>
            <Form.Group controlId="darkAmount" className="mb-3">
              <Form.Label>الكمية</Form.Label>
              <Form.Control
                type="number"
                value={darkAmount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDarkAmount(e.target.value)
                }
                placeholder="أدخل كمية اللحم الداكن"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="darkClient" className="mb-3">
              <Form.Label>اسم العميل</Form.Label>
              <Form.Control
                type="text"
                value={darkClient}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDarkClient(e.target.value)
                }
                placeholder="أدخل اسم العميل"
                required
              />
            </Form.Group>
          </Col>
        </Row>
      </fieldset>

      {/* قسم الأدوية الديناميكي */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">الأدوية</legend>
        {medicineItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col md={2}>
              <Form.Group controlId={`med-amount-${idx}`}>
                <Form.Label>الكمية</Form.Label>
                <Form.Control
                  type="number"
                  value={item.amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleMedicineChange(idx, 'amount', e.target.value)
                  }
                  placeholder="مثلاً: 2"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId={`med-unit-${idx}`}>
                <Form.Label>الوحدة</Form.Label>
                <Form.Control
                  type="text"
                  value={item.unit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleMedicineChange(idx, 'unit', e.target.value)
                  }
                  placeholder="مثلاً: علبة"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`med-type-${idx}`}>
                <Form.Label>النوع</Form.Label>
                <Form.Control
                  type="text"
                  value={item.type}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleMedicineChange(idx, 'type', e.target.value)
                  }
                  placeholder="مثلاً: مضاد حيوي"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`med-stor-${idx}`}>
                <Form.Label>مكان التخزين</Form.Label>
                <Form.Control
                  type="text"
                  value={item.stor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleMedicineChange(idx, 'stor', e.target.value)
                  }
                  placeholder="مثلاً: المخزن الرئيسي"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="danger"
                onClick={() => handleRemoveMedicine(idx)}
                disabled={medicineItems.length === 1}
                title="إزالة هذا الصف"
              >
                إزالة
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={handleAddMedicine}>
          إضافة دواء جديد
        </Button>
      </fieldset>

      {/* زر الإرسال */}
      <Button variant="primary" type="submit">
        حفظ التقرير اليومي
      </Button>
    </Form>
  );
}
