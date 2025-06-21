/* eslint-disable react-hooks/exhaustive-deps */
// src/contexts/FarmContext.tsx
import { useState, useEffect, type ReactNode } from "react";
import type { IRecursiveFarm } from "../models"; // تأكد أن مسار النموذج صحيح
import { fetchDocuments } from "../lib/methods"; // دوال CRUD الخاصة بـ Appwrite
import { client } from "../lib/appwrite"; // كائن Appwrite client
import { type Models } from "appwrite";
import { FarmContext } from "../contexts";

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farms, setFarms] = useState<IRecursiveFarm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const FARMS_COL = import.meta.env.VITE_APPWRITE_FARMS_COL_ID as string;
  const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID as string;
  const initFarms = async () => {
    await fetchDocuments(
      FARMS_COL,
      (data: IRecursiveFarm[]) => {
        setFarms(data);
        setLoading(false);
      },
      () => {
        // في حال الخطأ، نوقف التحميل ونترك المصفوفة فارغة
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    initFarms();

    // الاشتراك في التغييرات الفورية لقاعدة بيانات Appwrite
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${FARMS_COL}.documents`,
      (response) => {
        const payload = response.payload as Models.Document;
        const event = response.events.join(",");
        switch (true) {
          // عند إنشاء مستند جديد
          case event.includes("databases.*.collections.*.documents.*.create"):
            setFarms((prev) => [...prev, payload as IRecursiveFarm]);
            break;

          // عند تحديث مستند موجود
          case event.includes("databases.*.collections.*.documents.*.update"):
            setFarms((prev) =>
              prev.map((farm) =>
                farm.$id === payload.$id ? (payload as IRecursiveFarm) : farm
              )
            );
            break;

          // عند حذف مستند
          case event.includes("databases.*.collections.*.documents.*.delete"):
            setFarms((prev) => prev.filter((farm) => farm.$id !== payload.$id));
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
    // لا نضيف دوال أو متغيرات أخرى إلى القائمة؛ تشغيل هذا التأثير مرة واحدة عند المكوّن
  }, []);

  return (
    <FarmContext.Provider value={{ farms, loading }}>
      {children}
    </FarmContext.Provider>
  );
}
