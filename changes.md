fix: resolve TypeScript production build errors

- Downgrade MUI from v7 to v5 for better compatibility
- Fix Framer Motion props: change translateY/translateX to y/x
- Fix ref type issues: handle null values in RefObject types
- Remove unused variables: theme, Paper, colors, previewUrl, ref
- Remove invalid TypeScript compiler option 'erasableSyntaxOnly'
- Fix Grid component usage compatibility with MUI v5
- Remove unused tableSx prop from GlobalReportTable

Build now passes successfully with no TypeScript errors.

# تغييرات نظام إدارة مزرعة الدجاج

## التحديث الأخير - حساب عدد الفرخة قبل

### المشكلة
كان حساب "عدد الفرخة قبل" يستخدم قيمة افتراضية ثابتة (40000) لجميع التقارير.

### الحل
تم تعديل النظام لاستخدام القيمة الصحيحة من جدول المزرعة:

1. **للتقرير الأول**: يتم جلب قيمة `initialChecken` من جدول `farms` في قاعدة البيانات
2. **للتقارير التالية**: يتم حساب القيمة من القيمة السابقة مطروح منها النفوق

### التغييرات المطبقة

#### 1. تحديث `src/utils.ts`
- إضافة دالة `getInitialCheckenFromFarm()` لجلب `initialChecken` من جدول المزرعة
- تحسين معالجة الأخطاء والقيم الافتراضية

#### 2. تحديث `src/components/DailyReportItem.tsx`
- إضافة state لإدارة `initialChecken`
- استخدام `useEffect` لجلب قيمة `initialChecken` من المزرعة المحددة
- تمرير القيمة الصحيحة لجميع الحسابات المتعلقة بعدد الفرخة

### كيفية العمل
1. عند تحميل صفحة التقرير اليومي، يتم تحديد المزرعة المحددة
2. يتم جلب قيمة `initialChecken` من جدول `farms` باستخدام `farmId`
3. يتم استخدام هذه القيمة لحساب "عدد الفرخة قبل" في جميع التقارير
4. للتقارير اللاحقة، يتم خصم النفوق من القيمة السابقة

### الأمان والاستقرار
- في حالة عدم العثور على المزرعة أو حدوث خطأ، يتم استخدام القيمة الافتراضية (40000)
- تم إضافة رسائل تحذير في console لتتبع العمليات
- معالجة شاملة للأخطاء لضمان عدم توقف التطبيق

### الملفات المعدلة
- `src/utils.ts` - إضافة دالة جلب initialChecken
- `src/components/DailyReportItem.tsx` - تحديث منطق الحساب

