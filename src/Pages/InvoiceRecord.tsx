import { Form, Table } from 'react-bootstrap';
import FarmsFilter from '../components/FarmsFilter';
import { useFarms, useSelectedFarmContext } from '../contexts';
import { useEffect, useState } from 'react';
import type { IInvoice, InvoiceTypes, IRecursiveInvoice } from '../models';
import { fileService, invoiceService } from '../lib/appwrite';
import { Query } from 'appwrite';

type FileMeta = {
  fid: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
};

export default function InvoiceRecord() {
  const selectedFarm = useSelectedFarmContext()[0];
  const farms = useFarms().farms;
  const [type, setType] = useState<InvoiceTypes>('Sale');
  const [invoices, setInvoices] = useState<IRecursiveInvoice[]>([]);
  const [fileMetasMap, setFileMetasMap] = useState<Record<string, FileMeta[]>>(
    {}
  );

  // 1) جلب الفواتير حسب المزرعة والنوع
  useEffect(() => {
    if (!selectedFarm) return;
    invoiceService.list(
      (docs) => setInvoices(docs),
      () => alert('Error fetching invoices'),
      [Query.equal('farmId', selectedFarm), Query.equal('type', type)]
    );
  }, [selectedFarm, type]);

  // 2) جلب بيانات المرفقات وإعادة بناء الخريطة بالكامل
  useEffect(() => {
    const loadAllFileMetas = async () => {
      const newMap: Record<string, FileMeta[]> = {};

      for (const inv of invoices) {
        const ids = inv.fileIds || [];
        if (!ids.length) continue;

        const metas: FileMeta[] = [];
        for (const fid of ids) {
          try {
            const res = await fileService.getFile(fid);
            const mimeType = res.mimeType;
            metas.push({
              fid,
              previewUrl: fileService.getPreview(fid),
              downloadUrl: fileService.download(fid),
              mimeType,
            });
          } catch (err) {
            console.error('Failed fetching file meta for', fid, err);
          }
        }

        if (metas.length) {
          newMap[inv.$id] = metas;
        }
      }

      setFileMetasMap(newMap);
    };

    loadAllFileMetas();
  }, [invoices]);

  return (
    <div>
      <h1>الفواتير</h1>
      <FarmsFilter />

      <Form.Group className="mb-3">
        <Form.Select
          value={type}
          onChange={(e) => setType(e.target.value as InvoiceTypes)}
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
          {invoices.map((invoice, idx) => (
            <TableRow
              key={invoice.$id}
              invoiceType={type}
              invoice={invoice}
              index={idx}
              farmName={
                farms.find((f) => f.$id === invoice.farmId)?.name || 'غير معروف'
              }
              fileMetas={fileMetasMap[invoice.$id] || []}
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
  fileMetas: FileMeta[];
}) {
  const { invoice, index, invoiceType, farmName, fileMetas } = props;
  const total = invoice.amount * invoice.price;

  return (
    <tr>
      <td>{invoice.index}</td>
      <td>{index}</td>
      <td>{invoice.date}</td>
      <td>{invoice.time}</td>
      <td>{invoice.amount}</td>
      <td>{invoice.price}</td>
      <td>{total}</td>
      <td>{invoice.unit}</td>
      <td>{invoiceType === 'Medicine' ? farmName : invoice.meterial}</td>
      <td>
        {invoiceType === 'Medicine' ? invoice.meterial : invoice.customer}
      </td>
      <td>
        {fileMetas.length === 0 && <span>—</span>}
        {fileMetas.map(({ fid, previewUrl, downloadUrl, mimeType }) => {
          const isImage = mimeType.startsWith('image/');
          return (
            <div key={fid} style={{ marginBottom: 8 }}>
              {isImage && (
                <img
                  src={previewUrl + '&mode=admin'}
                  alt="preview"
                  style={{
                    maxWidth: 80,
                    maxHeight: 80,
                    display: 'block',
                    marginBottom: 4,
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
              )}
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                {isImage ? 'تحميل الصورة' : 'تحميل الملف'}
              </a>
            </div>
          );
        })}
      </td>
    </tr>
  );
}
