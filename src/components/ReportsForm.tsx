import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
import { reportsService, fileService } from '../lib/appwrite';
import { useFarms } from '../contexts';
import type { IDailyReport, IٍٍDailySale, IDailyMedicine } from '../models';
import type { Models } from 'appwrite';

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

interface IRecursiveDailyReport extends IDailyReport, Models.Document {}

interface FileMeta {
  fid: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
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

  // حالة التقارير
  const [reports, setReports] = useState<IRecursiveDailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<IRecursiveDailyReport | null>(null);
  const [existingFiles, setExistingFiles] = useState<FileMeta[]>([]);

  // تحميل التقارير
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    reportsService.list(
      (data) => {
        setReports(data);
        setLoading(false);
      },
      () => {
        alert('حدث خطأ أثناء تحميل التقارير');
        setLoading(false);
      }
    );
  };

  // تحميل بيانات الملفات للتقرير
  const loadReportFiles = async (fileIds: string[] = []) => {
    const fileMetas: FileMeta[] = [];
    for (const fid of fileIds) {
      try {
        const res = await fileService.getFile(fid);
        fileMetas.push({
          fid,
          previewUrl: fileService.getPreview(fid),
          downloadUrl: fileService.download(fid),
          mimeType: res.mimeType,
        });
      } catch (err) {
        console.error('خطأ في جلب بيانات الملف', fid, err);
      }
    }
    setExistingFiles(fileMetas);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
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
    setCurrentReportId(null);
    setEditMode(false);
    setExistingFiles([]);
  };

  // تحميل تقرير للتعديل
  const loadReportForEdit = (report: IRecursiveDailyReport) => {
    setDate(report.date);
    setTime(report.time);
    setFarmId(report.farmId);
    setProduction(report.production.toString());
    setDistortedProduction(report.distortedProduction.toString());
    setDeath(report.death.toString());
    setDailyFood(report.dailyFood.toString());
    setMonthlyFood(report.MonthlyFood.toString());
    
    const darkMeat = typeof report.darkMeat === 'string' ? JSON.parse(report.darkMeat) : report.darkMeat;
    setDarkAmount(darkMeat.amount.toString());
    setDarkClient(darkMeat.client);

    const sale = typeof report.sale === 'string' ? JSON.parse(report.sale) : report.sale;
    setSaleItems(sale.map((item: IٍٍDailySale) => ({
      amount: item.amount.toString(),
      weigh: item.weigh.toString(),
      client: item.client
    })));

    const medicine = typeof report.medicine === 'string' ? JSON.parse(report.medicine) : report.medicine;
    setMedicineItems(medicine.map((item: IDailyMedicine) => ({
      amount: item.amount.toString(),
      unit: item.unit,
      type: item.type,
      stor: item.stor
    })));

    setCurrentReportId(report.$id);
    setEditMode(true);
    loadReportFiles(report.fileIds);
  };

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

  // حذف ملف موجود
  const handleDeleteFile = async (fileId: string) => {
    try {
      // حذف الملف من التخزين
      await fileService.deleteFile(fileId);
      // تحديث قائمة الملفات
      setExistingFiles(prev => prev.filter(f => f.fid !== fileId));
    } catch (err) {
      console.error('خطأ في حذف الملف', err);
      alert('حدث خطأ أثناء حذف الملف');
    }
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
      fileIds: existingFiles.map(f => f.fid), // تحديث قائمة الملفات المتبقية فقط
    };

    // تحويل FileList إلى مصفوفة
    const fileArray = files ? Array.from(files) : [];

    if (editMode && currentReportId) {
      // تحديث تقرير موجود
      reportsService.update(
        currentReportId,
        report,
        fileArray,
        () => {
          alert('تم تحديث التقرير بنجاح');
          resetForm();
          loadReports();
        },
        () => alert('خطأ أثناء التحديث، حاول مجدداً.')
      );
    } else {
      // إنشاء تقرير جديد
      reportsService.create(
        report,
        fileArray,
        (newId) => {
          alert('تم الحفظ بنجاح. المعرف: ' + newId);
          resetForm();
          loadReports();
        },
        () => alert('خطأ أثناء الحفظ، حاول مجدداً.')
      );
    }
  };

  // حذف تقرير
  const handleDelete = () => {
    if (reportToDelete) {
      reportsService.delete(
        reportToDelete.$id,
        () => {
          setShowDeleteModal(false);
          setReportToDelete(null);
          loadReports();
          alert('تم حذف التقرير بنجاح');
        }
      );
    }
  };

  return (
    <div>
      <h2 className="mb-4">{editMode ? 'تعديل التقرير' : 'إضافة تقرير جديد'}</h2>
      
      <Form onSubmit={handleSubmit}>
        <Button variant="warning" onClick={handleAutoFill} className="mb-3">
          ملء وهمي
        </Button>

        {/* حقل رفع الملفات المتعدد */}
        <Form.Group controlId="files" className="mb-3">
          <Form.Label>رفع مرفقات (صور، PDF، Excel)</Form.Label>
          <Form.Control type="file" multiple onChange={handleFilesChange} />
        </Form.Group>

        {/* عرض الملفات الموجودة في وضع التعديل */}
        {editMode && existingFiles.length > 0 && (
          <div className="mb-3">
            <h5>الملفات المرفقة</h5>
            <div className="d-flex flex-wrap gap-3">
              {existingFiles.map((file) => (
                <div key={file.fid} className="position-relative">
                  {file.mimeType.startsWith('image/') ? (
                    <img
                      src={file.previewUrl}
                      alt="معاينة"
                      style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="border p-2 text-center" style={{ width: '150px' }}>
                      <i className="bi bi-file-earmark"></i>
                      <div className="small">ملف</div>
                    </div>
                  )}
                  <div className="mt-1">
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-info me-1"
                    >
                      تحميل
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteFile(file.fid)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <Form.Label>المزرعة</Form.Label>
              <Form.Select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                required
              >
                <option value="">اختر المزرعة</option>
                {farms?.map((farm) => (
                  <option key={farm.$id} value={farm.$id}>
                    {farm.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

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

        {/* المبيعات */}
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">المبيعات</legend>
          {saleItems.map((item, idx) => (
            <Row key={idx} className="align-items-end mb-2">
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="الكمية"
                  value={item.amount}
                  onChange={(e) => handleSaleChange(idx, 'amount', e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="الوزن"
                  value={item.weigh}
                  onChange={(e) => handleSaleChange(idx, 'weigh', e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="العميل"
                  value={item.client}
                  onChange={(e) => handleSaleChange(idx, 'client', e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveSale(idx)}
                  disabled={saleItems.length === 1}
                >
                  حذف
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="success" onClick={handleAddSale} className="mt-2">
            إضافة بيع
          </Button>
        </fieldset>

        {/* الأدوية */}
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">الأدوية</legend>
          {medicineItems.map((item, idx) => (
            <Row key={idx} className="align-items-end mb-2">
              <Col md={2}>
                <Form.Control
                  type="number"
                  placeholder="الكمية"
                  value={item.amount}
                  onChange={(e) => handleMedicineChange(idx, 'amount', e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="الوحدة"
                  value={item.unit}
                  onChange={(e) => handleMedicineChange(idx, 'unit', e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="النوع"
                  value={item.type}
                  onChange={(e) => handleMedicineChange(idx, 'type', e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="المخزن"
                  value={item.stor}
                  onChange={(e) => handleMedicineChange(idx, 'stor', e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveMedicine(idx)}
                  disabled={medicineItems.length === 1}
                >
                  حذف
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="success" onClick={handleAddMedicine} className="mt-2">
            إضافة دواء
          </Button>
        </fieldset>

        {/* اللحم الداكن */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="darkAmount" className="mb-3">
              <Form.Label>كمية اللحم الداكن</Form.Label>
              <Form.Control
                type="number"
                value={darkAmount}
                onChange={(e) => setDarkAmount(e.target.value)}
                placeholder="مثلاً: 12000"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="darkClient" className="mb-3">
              <Form.Label>عميل اللحم الداكن</Form.Label>
              <Form.Control
                type="text"
                value={darkClient}
                onChange={(e) => setDarkClient(e.target.value)}
                placeholder="مثلاً: وليد محمد عيد"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* النفوق والعلف */}
        <Row>
          <Col md={4}>
            <Form.Group controlId="death" className="mb-3">
              <Form.Label>النفوق</Form.Label>
              <Form.Control
                type="number"
                value={death}
                onChange={(e) => setDeath(e.target.value)}
                placeholder="مثلاً: 5"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="dailyFood" className="mb-3">
              <Form.Label>العلف اليومي</Form.Label>
              <Form.Control
                type="number"
                value={dailyFood}
                onChange={(e) => setDailyFood(e.target.value)}
                placeholder="مثلاً: 200"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="monthlyFood" className="mb-3">
              <Form.Label>العلف الشهري</Form.Label>
              <Form.Control
                type="number"
                value={monthlyFood}
                onChange={(e) => setMonthlyFood(e.target.value)}
                placeholder="مثلاً: 6000"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4">
          <Button variant="primary" type="submit" className="me-2">
            {editMode ? 'تحديث التقرير' : 'حفظ التقرير'}
          </Button>
          {editMode && (
            <Button variant="secondary" onClick={resetForm}>
              إلغاء التعديل
            </Button>
          )}
        </div>
      </Form>

      {/* جدول التقارير */}
      <h2 className="mt-5 mb-4">قائمة التقارير</h2>
      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>المزرعة</th>
              <th>الإنتاج</th>
              <th>الإنتاج المشوّه</th>
              <th>النفوق</th>
              <th>العلف اليومي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  لا توجد تقارير مسجلة
                </td>
              </tr>
            ) : (
              reports.map((report, index) => {
                const farm = farms?.find((f) => f.$id === report.farmId);
                return (
                  <tr key={report.$id}>
                    <td>{index + 1}</td>
                    <td>{report.date}</td>
                    <td>{report.time}</td>
                    <td>{farm?.name || report.farmId}</td>
                    <td>{report.production}</td>
                    <td>{report.distortedProduction}</td>
                    <td>{report.death}</td>
                    <td>{report.dailyFood}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => loadReportForEdit(report)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setReportToDelete(report);
                          setShowDeleteModal(true);
                        }}
                      >
                        حذف
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}

      {/* مودال تأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          هل أنت متأكد من حذف التقرير بتاريخ {reportToDelete?.date}؟
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            تأكيد الحذف
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
