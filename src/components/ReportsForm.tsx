import { useState, type ChangeEvent, type FormEvent } from 'react';
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
  // حقول أساسية
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [farmId, setFarmId] = useState('');
  const [production, setProduction] = useState('');
  const [distortedProduction, setDistortedProduction] = useState('');
  const [death, setDeath] = useState('');
  const [dailyFood, setDailyFood] = useState('');
  const [monthlyFood, setMonthlyFood] = useState('');
  // darkMeat كسلسلة JSON
  const [darkAmount, setDarkAmount] = useState('');
  const [darkClient, setDarkClient] = useState('');
  // جداول ديناميكية
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    { amount: '', weigh: '', client: '' },
  ]);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([
    { amount: '', unit: '', type: '', stor: '' },
  ]);
  // ملفات متعددة
  const [files, setFiles] = useState<FileList | null>(null);

  // إدارة الجداول
  const handleSaleChange = (i: number, f: keyof SaleItem, v: string) => {
    const upd = [...saleItems];
    upd[i][f] = v;
    setSaleItems(upd);
  };
  const handleAddSale = () =>
    setSaleItems([...saleItems, { amount: '', weigh: '', client: '' }]);
  const handleRemoveSale = (i: number) =>
    saleItems.length > 1 &&
    setSaleItems(saleItems.filter((_, idx) => idx !== i));

  const handleMedicineChange = (
    i: number,
    f: keyof MedicineItem,
    v: string
  ) => {
    const upd = [...medicineItems];
    upd[i][f] = v;
    setMedicineItems(upd);
  };
  const handleAddMedicine = () =>
    setMedicineItems([
      ...medicineItems,
      { amount: '', unit: '', type: '', stor: '' },
    ]);
  const handleRemoveMedicine = (i: number) =>
    medicineItems.length > 1 &&
    setMedicineItems(medicineItems.filter((_, idx) => idx !== i));

  // رفع الملفات
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  // تعبئة وهمية
  const handleAutoFill = () => {
    if (!farms?.length) return alert('أضف مزرعة أولاً.');
    const fId = farms[0].$id;
    setDate('2025-06-04');
    setTime('12:30');
    setFarmId(fId);
    setProduction('1000');
    setDistortedProduction('50');
    setDeath('5');
    setDailyFood('200');
    setMonthlyFood('6000');
    setDarkAmount('12000');
    setDarkClient('وليد محمد عيد');
    setSaleItems([
      { amount: '10', weigh: '5.2', client: 'عميل أول' },
      { amount: '8', weigh: '4.7', client: 'عميل ثاني' },
    ]);
    setMedicineItems([
      { amount: '2', unit: 'علبة', type: 'مضاد حيوي', stor: 'المخزن الرئيسي' },
      { amount: '5', unit: 'حقنة', type: 'فيتامينات', stor: 'المخزن الجانبي' },
    ]);
  };

  // إرسال النموذج
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // تجميع البيانات
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

    // تحويل FileList إلى مصفوفة
    const fileArray = files ? Array.from(files) : [];

    // استدعاء الخدمة
    reportsService.create(
      report,
      fileArray,
      (newId) => {
        alert('تم الحفظ بنجاح. المعرف: ' + newId);
        // إعادة تهيئة الحقول
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
        setFiles(null);
      },
      () => alert('خطأ أثناء الحفظ، حاول مجدداً.')
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Button variant="warning" onClick={handleAutoFill} className="mb-3">
        ملء وهمي
      </Button>

      {/* حقل رفع الملفات المتعدد */}
      <Form.Group controlId="files" className="mb-3">
        <Form.Label>رفع مرفقات (صور، PDF، Excel)</Form.Label>
        <Form.Control type="file" multiple onChange={handleFilesChange} />
      </Form.Group>

      {/* حقول التاريخ والوقت والمزرعة */}
      <Row>
        <Col md={4}>
          <Form.Group controlId="date" className="mb-3">
            <Form.Label>التاريخ</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="time" className="mb-3">
            <Form.Label>الوقت</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="farmId" className="mb-3">
            <Form.Label>معرّف المزرعة</Form.Label>
            <Form.Control
              type="text"
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              placeholder="أدخل معرّف المزرعة"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* بقية الحقول... */}
      {/* الإنتاج والإنتاج المشوّه */}
      <Row>
        <Col md={6}>
          <Form.Group controlId="production" className="mb-3">
            <Form.Label>الإنتاج</Form.Label>
            <Form.Control
              type="number"
              value={production}
              onChange={(e) => setProduction(e.target.value)}
              placeholder="مثلاً: 1000"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="distortedProduction" className="mb-3">
            <Form.Label>الإنتاج المشوّه</Form.Label>
            <Form.Control
              type="number"
              value={distortedProduction}
              onChange={(e) => setDistortedProduction(e.target.value)}
              placeholder="مثلاً: 50"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* المبيعات الديناميكية */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">المبيعات</legend>
        {saleItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col md={3}>
              <Form.Control
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleSaleChange(idx, 'amount', e.target.value)
                }
                placeholder="الكمية"
                required
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="number"
                step="0.01"
                value={item.weigh}
                onChange={(e) => handleSaleChange(idx, 'weigh', e.target.value)}
                placeholder="الوزن"
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                value={item.client}
                onChange={(e) =>
                  handleSaleChange(idx, 'client', e.target.value)
                }
                placeholder="اسم العميل"
                required
              />
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="danger"
                onClick={() => handleRemoveSale(idx)}
                disabled={saleItems.length === 1}
              >
                إزالة
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={handleAddSale}>
          إضافة بيع
        </Button>
      </fieldset>

      {/* الوفيات والطعام */}
      <Form.Group controlId="death" className="mb-3">
        <Form.Label>عدد الوفيات</Form.Label>
        <Form.Control
          type="number"
          value={death}
          onChange={(e) => setDeath(e.target.value)}
          required
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group controlId="dailyFood" className="mb-3">
            <Form.Label>الطعام اليومي</Form.Label>
            <Form.Control
              type="number"
              value={dailyFood}
              onChange={(e) => setDailyFood(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="monthlyFood" className="mb-3">
            <Form.Label>الطعام الشهري</Form.Label>
            <Form.Control
              type="number"
              value={monthlyFood}
              onChange={(e) => setMonthlyFood(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* اللحم الداكن */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">اللحم الداكن</legend>
        <Row>
          <Col md={6}>
            <Form.Control
              type="number"
              value={darkAmount}
              onChange={(e) => setDarkAmount(e.target.value)}
              placeholder="الكمية"
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              value={darkClient}
              onChange={(e) => setDarkClient(e.target.value)}
              placeholder="اسم العميل"
              required
            />
          </Col>
        </Row>
      </fieldset>

      {/* الأدوية الديناميكية */}
      <fieldset className="border p-3 mb-3">
        <legend className="w-auto px-2">الأدوية</legend>
        {medicineItems.map((item, idx) => (
          <Row key={idx} className="align-items-end mb-2">
            <Col md={2}>
              <Form.Control
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleMedicineChange(idx, 'amount', e.target.value)
                }
                placeholder="الكمية"
                required
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="text"
                value={item.unit}
                onChange={(e) =>
                  handleMedicineChange(idx, 'unit', e.target.value)
                }
                placeholder="الوحدة"
                required
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                value={item.type}
                onChange={(e) =>
                  handleMedicineChange(idx, 'type', e.target.value)
                }
                placeholder="النوع"
                required
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                value={item.stor}
                onChange={(e) =>
                  handleMedicineChange(idx, 'stor', e.target.value)
                }
                placeholder="مكان التخزين"
                required
              />
            </Col>
            <Col md={2} className="text-center">
              <Button
                variant="danger"
                onClick={() => handleRemoveMedicine(idx)}
                disabled={medicineItems.length === 1}
              >
                إزالة
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={handleAddMedicine}>
          إضافة دواء
        </Button>
      </fieldset>

      <Button variant="primary" type="submit">
        حفظ التقرير اليومي
      </Button>
    </Form>
  );
}
