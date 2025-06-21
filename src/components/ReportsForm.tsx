import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { IDailyReport, IٍٍDailySale, IDailyMedicine } from "../models";
import { reportsService, fileService } from "../lib/appwrite";
import { useFarms } from "../contexts";
import type { Models } from "appwrite";
import "../Pages/styles.css";
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

// Add weight ranges array
const weightRanges = [
  "1800/1850",
  "1850/1900",
  "1900/1950",
  "1950/2000",
  "2000/2050",
  "2050/2100",
];

export default function ReportsForm() {
  const { farms } = useFarms();
  // حقول أساسية
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [farmId, setFarmId] = useState("");
  const [production, setProduction] = useState("");
  const [distortedProduction, setDistortedProduction] = useState("");
  const [death, setDeath] = useState("");
  const [dailyFood, setDailyFood] = useState("");
  const [monthlyFood, setMonthlyFood] = useState("");
  // darkMeat كسلسلة JSON
  const [darkAmount, setDarkAmount] = useState("");
  const [darkClient, setDarkClient] = useState("");
  // جداول ديناميكية
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([]);
  // ملفات متعددة
  const [files, setFiles] = useState<FileList | null>(null);

  // حالة التقارير
  const [reports, setReports] = useState<IRecursiveDailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] =
    useState<IRecursiveDailyReport | null>(null);
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
        alert("حدث خطأ أثناء تحميل التقارير");
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
        console.error("خطأ في جلب بيانات الملف", fid, err);
      }
    }
    setExistingFiles(fileMetas);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setDate("");
    setTime("");
    setFarmId("");
    setProduction("");
    setDistortedProduction("");
    setDeath("");
    setDailyFood("");
    setMonthlyFood("");
    setDarkAmount("");
    setDarkClient("");
    setSaleItems([{ amount: "", weigh: "", client: "" }]);
    setMedicineItems([{ amount: "", unit: "", type: "", stor: "" }]);
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

    const darkMeat =
      typeof report.darkMeat === "string"
        ? JSON.parse(report.darkMeat)
        : report.darkMeat;
    setDarkAmount(darkMeat.amount.toString());
    setDarkClient(darkMeat.client);

    const sale =
      typeof report.sale === "string" ? JSON.parse(report.sale) : report.sale;
    setSaleItems(
      sale.map((item: IٍٍDailySale) => ({
        amount: item.amount.toString(),
        weigh: item.weigh.toString(),
        client: item.client,
      }))
    );

    const medicine =
      typeof report.medicine === "string"
        ? JSON.parse(report.medicine)
        : report.medicine;
    setMedicineItems(
      medicine.map((item: IDailyMedicine) => ({
        amount: item.amount.toString(),
        unit: item.unit,
        type: item.type,
        stor: item.stor,
      }))
    );

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
    setSaleItems([...saleItems, { amount: "", weigh: "", client: "" }]);
  const handleRemoveSale = (i: number) =>
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
      { amount: "", unit: "", type: "", stor: "" },
    ]);
  const handleRemoveMedicine = (i: number) =>
    setMedicineItems(medicineItems.filter((_, idx) => idx !== i));

  // رفع الملفات
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  // تعبئة وهمية
  const handleAutoFill = () => {
    if (!farms?.length) return alert("أضف مزرعة أولاً.");
    const fId = farms[0].$id;
    // setDate('2025-06-04');
    // setTime('12:30');
    setFarmId(fId);
    setProduction("1000");
    setDistortedProduction("50");
    setDeath("5");
    setDailyFood("200");
    setMonthlyFood("6000");
    setDarkAmount("12000");
    setDarkClient("وليد محمد عيد");
    setSaleItems([
      { amount: "10", weigh: weightRanges[0], client: "عميل أول" },
      { amount: "8", weigh: weightRanges[1], client: "عميل ثاني" },
    ]);
    setMedicineItems([
      { amount: "2", unit: "علبة", type: "مضاد حيوي", stor: "المخزن الرئيسي" },
      { amount: "5", unit: "حقنة", type: "فيتامينات", stor: "المخزن الجانبي" },
    ]);
  };

  // حذف ملف موجود
  const handleDeleteFile = async (fileId: string) => {
    try {
      // حذف الملف من التخزين
      await fileService.deleteFile(fileId);
      // تحديث قائمة الملفات
      setExistingFiles((prev) => prev.filter((f) => f.fid !== fileId));
    } catch (err) {
      console.error("خطأ في حذف الملف", err);
      alert("حدث خطأ أثناء حذف الملف");
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
      fileIds: existingFiles.map((f) => f.fid), // تحديث قائمة الملفات المتبقية فقط
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
          alert("تم تحديث التقرير بنجاح");
          resetForm();
          loadReports();
        },
        () => alert("خطأ أثناء التحديث، حاول مجدداً.")
      );
    } else {
      // إنشاء تقرير جديد
      reportsService.create(
        report,
        fileArray,
        (newId) => {
          alert("تم الحفظ بنجاح. المعرف: " + newId);
          resetForm();
          loadReports();
        },
        () => alert("خطأ أثناء الحفظ، حاول مجدداً.")
      );
    }
  };

  // حذف تقرير
  const handleDelete = () => {
    if (reportToDelete) {
      reportsService.delete(reportToDelete.$id, () => {
        setShowDeleteModal(false);
        setReportToDelete(null);
        loadReports();
        alert("تم حذف التقرير بنجاح");
      });
    }
  };

  useEffect(() => {
    // تعبئة التاريخ بصيغة yyyy-mm-dd
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);

    // تعبئة الوقت بصيغة hh:mm:ss
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    setTime(`${hh}:${min}:${ss}`);
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 3 } }}>
      <Typography
        variant="h5"
        sx={{ color: "#c62828", fontWeight: 700 }}
        mb={3}
        textAlign="center"
      >
        {editMode ? "تعديل التقرير" : "إضافة تقرير جديد"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleAutoFill}
            sx={{ fontWeight: 700 }}
          >
            ملء وهمي
          </Button>
        </Stack>

        <Box mb={2}>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#c62828",
              color: "#c62828",
              fontWeight: 700,
              "&:hover": {
                borderColor: "#b71c1c",
                color: "#b71c1c",
                backgroundColor: "#ffeaea",
              },
            }}
          >
            رفع مرفقات
            <input type="file" hidden multiple onChange={handleFilesChange} />
          </Button>
        </Box>

        {/* عرض الملفات الموجودة في وضع التعديل */}
        {editMode && existingFiles.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              الملفات المرفقة
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {existingFiles.map((file) => (
                <Box key={file.fid} textAlign="center">
                  {file.mimeType.startsWith("image/") ? (
                    <img
                      src={file.previewUrl}
                      alt="معاينة"
                      style={{
                        maxWidth: "150px",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 150,
                        height: 150,
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        mb: 1,
                      }}
                    >
                      <CloudUploadIcon fontSize="large" color="disabled" />
                    </Box>
                  )}
                  <Stack
                    spacing={0.5}
                    direction="row"
                    justifyContent="center"
                    mt={1}
                  >
                    <Button
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      color="info"
                    >
                      تحميل
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteFile(file.fid)}
                    >
                      حذف
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="التاريخ"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="الوقت"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth sx={{ minWidth: 180 }}>
              <InputLabel id="farm-label">المزرعة</InputLabel>
              <Select
                labelId="farm-label"
                value={farmId}
                label="المزرعة"
                onChange={(e) => setFarmId(e.target.value)}
                required
                sx={{
                  borderRadius: 2,
                  background: "#fff",
                  height: 56, // نفس ارتفاع TextField الافتراضي
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 250 },
                  },
                }}
              >
                <MenuItem value="">اختر المزرعة</MenuItem>
                {farms?.map((farm) => (
                  <MenuItem key={farm.$id} value={farm.$id}>
                    {farm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="الإنتاج"
              type="number"
              value={production}
              onChange={(e) => setProduction(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="الإنتاج المشوّه"
              type="number"
              value={distortedProduction}
              onChange={(e) => setDistortedProduction(e.target.value)}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        {/* المبيعات */}
        <Box mb={2} p={2} border="1px solid #eee" borderRadius={2}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            sx={{ color: "#c62828", fontSize: "1.2rem" }}
          >
            المبيعات
          </Typography>
          {saleItems.length > 0 &&
            saleItems.map((item, idx) => (
              <Grid container spacing={2} alignItems="center" mb={1} key={idx}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="number"
                    label="الكمية"
                    value={item.amount}
                    onChange={(e) =>
                      handleSaleChange(idx, "amount", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth sx={{ minWidth: 140 }}>
                    <InputLabel id={`weigh-label-${idx}`}>الوزن</InputLabel>
                    <Select
                      labelId={`weigh-label-${idx}`}
                      value={item.weigh}
                      label="الوزن"
                      onChange={(e) =>
                        handleSaleChange(idx, "weigh", e.target.value)
                      }
                      required
                      sx={{
                        borderRadius: 2,
                        background: "#fff",
                        height: 56, // نفس ارتفاع TextField الافتراضي
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: 250 },
                        },
                      }}
                    >
                      <MenuItem value="">اختر الوزن</MenuItem>
                      {weightRanges.map((range) => (
                        <MenuItem key={range} value={range}>
                          {range}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="العميل"
                    value={item.client}
                    onChange={(e) =>
                      handleSaleChange(idx, "client", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveSale(idx)}
                    sx={{ minWidth: 0, px: 2 }}
                  >
                    حذف
                  </Button>
                </Grid>
              </Grid>
            ))}
          <Stack direction="row" gap={1} mt={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSale}
              sx={{
                backgroundColor: "#c62828",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              إضافة بيع
            </Button>
            {saleItems.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setSaleItems([])}
                sx={{
                  color: "#c62828",
                  // marginRight: 2,
                }}
              >
                حذف الكل
              </Button>
            )}
          </Stack>
        </Box>

        {/* الأدوية */}
        <Box mb={2} p={2} border="1px solid #eee" borderRadius={2}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            sx={{ color: "#c62828", fontSize: "1.2rem" }}
          >
            الأدوية
          </Typography>
          {medicineItems.length > 0 &&
            medicineItems.map((item, idx) => (
              <Grid container spacing={2} alignItems="center" mb={1} key={idx}>
                <Grid item xs={12} sm={2}>
                  <TextField
                    type="number"
                    label="الكمية"
                    value={item.amount}
                    onChange={(e) =>
                      handleMedicineChange(idx, "amount", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="الوحدة"
                    value={item.unit}
                    onChange={(e) =>
                      handleMedicineChange(idx, "unit", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="النوع"
                    value={item.type}
                    onChange={(e) =>
                      handleMedicineChange(idx, "type", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="المخزن"
                    value={item.stor}
                    onChange={(e) =>
                      handleMedicineChange(idx, "stor", e.target.value)
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveMedicine(idx)}
                    sx={{ minWidth: 0, px: 2 }}
                  >
                    حذف
                  </Button>
                </Grid>
              </Grid>
            ))}
          <Stack direction="row" gap={1} mt={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMedicine}
              sx={{
                backgroundColor: "#c62828",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              إضافة دواء
            </Button>
            {medicineItems.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setMedicineItems([])}
              >
                حذف الكل
              </Button>
            )}
          </Stack>
        </Box>

        {/* السواد */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="كمية السواد"
              type="number"
              value={darkAmount}
              onChange={(e) => setDarkAmount(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="عميل السواد"
              value={darkClient}
              onChange={(e) => setDarkClient(e.target.value)}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        {/* النفوق والعلف */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="النفوق"
              type="number"
              value={death}
              onChange={(e) => setDeath(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="العلف اليومي"
              type="number"
              value={dailyFood}
              onChange={(e) => setDailyFood(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="العلف الشهري"
              type="number"
              value={monthlyFood}
              onChange={(e) => setMonthlyFood(e.target.value)}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mb={3}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#c62828",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {editMode ? "تحديث التقرير" : "حفظ التقرير"}
          </Button>
          {editMode && (
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              إلغاء التعديل
            </Button>
          )}
        </Stack>
      </Box>

      <Divider sx={{ my: 3, borderColor: "#c62828" }} />

      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        mt={4}
        sx={{ color: "#c62828" }}
      >
        قائمة التقارير
      </Typography>
      {loading ? (
        <Typography>جاري تحميل البيانات...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  التاريخ
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  الوقت
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  المزرعة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  الإنتاج
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  الإنتاج المشوّه
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  النفوق
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  العلف اليومي
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: "#c62828",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    letterSpacing: 1,
                  }}
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    لا توجد تقارير مسجلة
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => {
                  const farm = farms?.find((f) => f.$id === report.farmId);
                  return (
                    <TableRow key={report.$id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{report.date}</TableCell>
                      <TableCell align="center">{report.time}</TableCell>
                      <TableCell align="center">
                        {farm?.name || report.farmId}
                      </TableCell>
                      <TableCell align="center">{report.production}</TableCell>
                      <TableCell align="center">
                        {report.distortedProduction}
                      </TableCell>
                      <TableCell align="center">{report.death}</TableCell>
                      <TableCell align="center">{report.dailyFood}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => loadReportForEdit(report)}
                          sx={{
                            color: "#fff",
                            backgroundColor: "#1976d2",
                            mx: 0.5,
                            "&:hover": { backgroundColor: "#115293" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setReportToDelete(report);
                            setShowDeleteModal(true);
                          }}
                          sx={{
                            color: "#fff",
                            backgroundColor: "#c62828",
                            mx: 0.5,
                            "&:hover": { backgroundColor: "#b71c1c" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          هل أنت متأكد من حذف التقرير بتاريخ {reportToDelete?.date}؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            إلغاء
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            sx={{ color: "#c62828" }}
          >
            تأكيد الحذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
