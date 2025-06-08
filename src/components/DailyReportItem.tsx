import { useState, useEffect } from 'react';
import type { IDailyReport, IٍٍDailySale } from '../models';
import {
  calculatePercentageAndTotal,
  getCartorCalc,
  getCheckenAmountBefore,
  getFoodPercentage,
  getPreviousCumulative,
} from '../utils';
import { fileService } from '../lib/appwrite';

type FileMeta = {
  fid: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
};

export default function DailyReportItem(props: {
  dailyReports: IDailyReport[];
}) {
  // fileMetas: خريطة لكل تقرير إلى بيانات ملفاته
  const [fileMetas, setFileMetas] = useState<Record<number, FileMeta[]>>({});

  useEffect(() => {
    props.dailyReports.forEach((item, idx) => {
      const ids = item.fileIds || [];
      if (ids.length === 0) return;

      ids.forEach(async (fid) => {
        try {
          const res = await fileService.getFile(fid);
          const mimeType = res.mimeType;
          const meta: FileMeta = {
            fid,
            previewUrl: fileService.getPreview(fid),
            downloadUrl: fileService.download(fid),
            mimeType,
          };
          setFileMetas((prev) => ({
            ...prev,
            [idx]: prev[idx] ? [...prev[idx], meta] : [meta],
          }));
        } catch (err) {
          console.error('خطأ جلب بيانات الملف', fid, err);
        }
      });
    });
  }, [props.dailyReports]);

  return (
    <>
      {props.dailyReports.map((item, index) => {
        // فك JSON إذا كان نصّياً
        const sale =
          typeof item.sale === 'string' ? JSON.parse(item.sale) : item.sale;
        const darkMeat =
          typeof item.darkMeat === 'string'
            ? JSON.parse(item.darkMeat)
            : item.darkMeat;
        const metas = fileMetas[index] || [];

        return (
          <tr key={item.date + item.time + index}>
            <td>{index}</td>
            <td>{item.date}</td>
            <td>{item.time}</td>
            <td>{item.production}</td>
            <td>{item.distortedProduction}</td>
            <td>{getCartorCalc(item)}</td>
            <td>
              {sale.reduce(
                (acc: number, it: IٍٍDailySale) => acc + it.amount,
                0
              )}
            </td>
            <td>{getPreviousCumulative(item, props.dailyReports)}</td>
            <td>{(item.production + item.distortedProduction) * 30}</td>
            <td>
              {calculatePercentageAndTotal(
                (item.production + item.distortedProduction) * 30,
                getCheckenAmountBefore(item, undefined, props.dailyReports)
              )}
            </td>
            <td>
              {getCheckenAmountBefore(item, undefined, props.dailyReports)}
            </td>
            <td>{item.death}</td>
            <td>
              {getCheckenAmountBefore(item, undefined, props.dailyReports) -
                item.death}
            </td>
            <td>{item.dailyFood}</td>
            <td>
              {getFoodPercentage(
                item.dailyFood,
                getCheckenAmountBefore(item, undefined, props.dailyReports)
              )}
            </td>
            <td>{darkMeat.amount}</td>

            {/* عمود المرفقات بعد التعديل */}
            <td>
              {metas.length === 0 && <span>—</span>}
              {metas.map(({ fid, previewUrl, downloadUrl, mimeType }) => {
                console.log(previewUrl);
                
                const isImage = mimeType.startsWith('image/');
                return (
                  <div key={fid} style={{ marginBottom: 8 }}>
                    {isImage && (
                      <img
                        src={`https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_FILE_BUCKET_ID}/files/${fid}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                        alt="معاينة صورة"
                        style={{
                          maxWidth: 80,
                          maxHeight: 80,
                          display: 'block',
                          marginBottom: 4,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {isImage ? 'تحميل الصورة' : 'تحميل الملف'}
                    </a>
                  </div>
                );
              })}
            </td>
          </tr>
        );
      })}
    </>
  );
}
