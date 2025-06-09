import { useState, type FormEvent, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
import type { InvoiceTypes, IInvoice, IRecursiveInvoice } from '../models';
import { useFarms } from '../contexts';
import { invoiceService, fileService } from '../lib/appwrite';

export interface InvoiceItem {
  meterial: string;
  unit: string;
  amount: number;
  price: number;
  files?: FileList | null;
}

type FileMeta = {
  fid: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
};

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

  // حالة الفواتير
  const [invoices, setInvoices] = useState<IRecursiveInvoice[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<IRecursiveInvoice | null>(null);
  const [existingFiles, setExistingFiles] = useState<FileMeta[]>([]);

  // قائمة الأوزان للبيض
  const weightRanges = [
    "1800/1850",
    "1850/1900",
    "1900/1950",
    "1950/2000",
    "2000/2050",
    "2050/2100",
  ];

  // تحميل الفواتير
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    invoiceService.list(
      (data) => {
        setInvoices(data);
      },
      () => {
        alert('حدث خطأ أثناء تحميل الفواتير');
      }
    );
  };

  // تحميل بيانات الملفات للفاتورة
  const loadInvoiceFiles = async (fileIds: string[] = []) => {
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
    setType('Sale');
    setIndex('');
    setFarm('');
    setDate('');
    setTime('');
    setCustomer('');
    setInvoiceItems([{ meterial: '', unit: '', amount: 0, price: 0, files: null }]);
    setCurrentInvoiceId(null);
    setEditMode(false);
    setExistingFiles([]);
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

  // تحميل فاتورة للتعديل
  const loadInvoiceForEdit = (invoice: IRecursiveInvoice) => {
    setType(invoice.type);
    setIndex(invoice.index);
    setFarm(invoice.farmId);
    setDate(invoice.date);
    setTime(invoice.time);
    setCustomer(invoice.customer);
    setInvoiceItems([{
      meterial: invoice.meterial,
      unit: invoice.unit,
      amount: invoice.amount,
      price: invoice.price,
      files: null
    }]);
    setCurrentInvoiceId(invoice.$id);
    setEditMode(true);
    loadInvoiceFiles(invoice.fileIds);
  };

  // حذف فاتورة
  const handleDelete = () => {
    if (invoiceToDelete) {
      invoiceService.delete(
        invoiceToDelete.$id,
        () => {
          setShowDeleteModal(false);
          setInvoiceToDelete(null);
          loadInvoices();
          alert('تم حذف الفاتورة بنجاح');
        }
      );
    }
  };

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
          fileIds: existingFiles.map(f => f.fid),
        };
        const filesArray = item.files ? Array.from(item.files) : [];
        
        if (editMode && currentInvoiceId) {
          return new Promise<void>((resolve, reject) => {
            invoiceService.update(
              currentInvoiceId,
              invoiceData,
              filesArray,
              () => resolve(),
              () => reject()
            );
          });
        } else {
          return new Promise<void>((resolve, reject) => {
            invoiceService.create(
              invoiceData,
              filesArray,
              () => resolve(),
              () => reject()
            );
          });
        }
      });

      await Promise.all(promises);
      alert(editMode ? 'تم تحديث الفاتورة بنجاح' : 'تم حفظ الفاتورة بنجاح');
      resetForm();
      loadInvoices();
    } catch {
      alert('حدث خطأ أثناء حفظ الفاتورة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">{editMode ? 'تعديل الفاتورة' : 'إضافة فاتورة جديدة'}</h2>

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
                <option value="Sale">بيض</option>
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
          <Table className="mb-3">
            <thead>
              <tr>
                <th>المادة</th>
                <th>الوحدة</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الملفات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    {type === 'Sale' ? (
                      <Form.Select
                        value={item.meterial}
                        onChange={(e) => handleItemChange(index, 'meterial', e.target.value)}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">اختر الوزن</option>
                        {weightRanges.map((weight) => (
                          <option key={weight} value={weight}>
                            {weight}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="text"
                        value={item.meterial}
                        onChange={(e) => handleItemChange(index, 'meterial', e.target.value)}
                        placeholder="أدخل المادة"
                        required
                        disabled={isSubmitting}
                      />
                    )}
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="الوحدة"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      placeholder="الكمية"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(index, 'amount', e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      placeholder="السعر"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'files',
                          (e.target as HTMLInputElement).files
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={invoiceItems.length === 1 || isSubmitting}
                    >
                      حذف
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            variant="secondary"
            onClick={handleAddItem}
            disabled={isSubmitting}
          >
            إضافة عنصر
          </Button>
        </div>

        {/* عرض الملفات الموجودة في وضع التعديل */}
        {editMode && existingFiles.length > 0 && (
          <div className="mb-3">
            <h5>الملفات المرفقة</h5>
            <div className="d-flex flex-wrap gap-3">
              {existingFiles.map((file) => (
                <div key={file.fid} className="text-center">
                  {file.mimeType.startsWith('image/') ? (
                    <img
                      src={file.previewUrl}
                      alt="preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        marginBottom: '8px'
                      }}
                    >
                      <i className="bi bi-file-earmark"></i>
                    </div>
                  )}
                  <div className="d-flex flex-column gap-1">
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
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

        {/* أزرار الإرسال والملء التلقائي */}
        <div className="d-flex gap-2 mb-4">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الحفظ...' : editMode ? 'تحديث الفاتورة' : 'حفظ الفاتورة'}
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

      {/* جدول الفواتير */}
      <h3 className="mt-5 mb-3">الفواتير</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>نوع الفاتورة</th>
            <th>رقم الفاتورة</th>
            <th>المزرعة</th>
            <th>التاريخ</th>
            <th>التوقيت</th>
            <th>العميل</th>
            <th>المادة</th>
            <th>الوحدة</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>المبلغ الإجمالي</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.$id}>
              <td>
                {invoice.type === 'Sale' ? 'بيض' : 
                 invoice.type === 'DarkMeet' ? 'سواد' : 'دواء'}
              </td>
              <td>{invoice.index}</td>
              <td>{farms.find(f => f.$id === invoice.farmId)?.name || 'غير معروف'}</td>
              <td>{invoice.date}</td>
              <td>{invoice.time}</td>
              <td>{invoice.customer}</td>
              <td>{invoice.meterial}</td>
              <td>{invoice.unit}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.price}</td>
              <td>{invoice.amount * invoice.price}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => loadInvoiceForEdit(invoice)}
                >
                  تعديل
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setInvoiceToDelete(invoice);
                    setShowDeleteModal(true);
                  }}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* نافذة تأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          هل أنت متأكد من حذف هذه الفاتورة؟
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
