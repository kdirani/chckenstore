import { useState, type FormEvent, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
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
  Stack,
  Slide,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { InvoiceTypes, IInvoice, IRecursiveInvoice } from "../models";
import { useFarms } from "../contexts";
import { invoiceService, fileService } from "../lib/appwrite";
import "../Pages/styles.css";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: any,
  ref
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function InvoicesForm() {
  const { farms } = useFarms();

  // حقول رئيسية
  const [type, setType] = useState<InvoiceTypes>("Sale");
  const [index, setIndex] = useState<number | "">("");
  const [farm, setFarm] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // عناصر الفاتورة مع ملفات لكل عنصر
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { meterial: "", unit: "", amount: 0, price: 0, files: null },
  ]);

  // حالة الفواتير
  const [invoices, setInvoices] = useState<IRecursiveInvoice[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<IRecursiveInvoice | null>(null);
  const [existingFiles, setExistingFiles] = useState<FileMeta[]>([]);

  // مودال النجاح
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IRecursiveInvoice | null>(null);

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
        alert("حدث خطأ أثناء تحميل الفواتير");
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
        console.error("خطأ في جلب بيانات الملف", fid, err);
      }
    }
    setExistingFiles(fileMetas);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setType("Sale");
    setIndex("");
    setFarm("");
    setDate("");
    setTime("");
    setCustomer("");
    setInvoiceItems([
      { meterial: "", unit: "", amount: 0, price: 0, files: null },
    ]);
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
      setExistingFiles((prev) => prev.filter((f) => f.fid !== fileId));
    } catch (err) {
      console.error("خطأ في حذف الملف", err);
      alert("حدث خطأ أثناء حذف الملف");
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
    setInvoiceItems([
      {
        meterial: invoice.meterial,
        unit: invoice.unit,
        amount: invoice.amount,
        price: invoice.price,
        files: null,
      },
    ]);
    setCurrentInvoiceId(invoice.$id);
    setEditMode(true);
    loadInvoiceFiles(invoice.fileIds);
  };

  // حذف فاتورة
  const handleDelete = () => {
    if (invoiceToDelete) {
      invoiceService.delete(invoiceToDelete.$id, () => {
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
        loadInvoices();
        setShowDeleteSuccessModal(true); // عرض مودال النجاح بعد الحذف
      });
    }
  };

  // تغيير بيانات عنصر
  const handleItemChange = (
    idx: number,
    field: keyof InvoiceItem,
    value: string | FileList | null
  ) => {
    const updated = [...invoiceItems];
    if (field === "amount" || field === "price") {
      updated[idx][field] = Number(value as string);
    } else if (field === "files") {
      updated[idx].files = value as FileList;
      // أضف هذا السطر لحفظ اسم الملف الأول (إن وجد)
      updated[idx].fileName = value && value.length > 0 ? value[0].name : "";
    } else {
      updated[idx][field] = value as string;
    }
    setInvoiceItems(updated);
  };

  const handleAddItem = () =>
    setInvoiceItems([
      ...invoiceItems,
      { meterial: "", unit: "", amount: 0, price: 0, files: null },
    ]);
  const handleRemoveItem = (idx: number) => {
    if (invoiceItems.length === 1) return;
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  // تعبئة وهمية
  const handleAutoFill = () => {
    if (!farms.length) {
      alert("لا توجد مزارع متاحة");
      return;
    }
    const farmId = farms[0].$id;
    const now = new Date();
    setType("Sale");
    setIndex(12345);
    setFarm(farmId);
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().split(" ")[0]);
    setCustomer("عميل تجريبي");
    setInvoiceItems([
      { meterial: "بيض", unit: "صندوق", amount: 10, price: 15, files: null },
      { meterial: "دجاج", unit: "كيلو", amount: 5, price: 20, files: null },
    ]);
  };

  // إرسال الفاتورة
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // تحقق من الحقول الأساسية
    if (
      index === "" ||
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
      alert("يرجى تعبئة جميع الحقول والتحقق من صحة عناصر الفاتورة");
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
          fileIds: existingFiles.map((f) => f.fid),
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
      setShowSuccessModal(true); // <-- هنا عرض المودال
      resetForm();
      loadInvoices();
    } catch {
      alert("حدث خطأ أثناء حفظ الفاتورة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItemFile = (idx: number) => {
    const updated = [...invoiceItems];
    updated[idx].files = null;
    updated[idx].fileName = "";
    setInvoiceItems(updated);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 3 } }}>
      <Typography
        variant="h5"
        color="#c62828"
        fontWeight={700}
        mb={3}
        textAlign="center"
      >
        {editMode ? "تعديل الفاتورة" : "إضافة فاتورة جديدة"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
          <FormControl fullWidth>
            <InputLabel id="type-label">نوع الفاتورة</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="نوع الفاتورة"
              onChange={(e) => setType(e.target.value as InvoiceTypes)}
              disabled={isSubmitting}
              sx={{ ml: 1 }}
            >
              <MenuItem value="Sale">بيض</MenuItem>
              <MenuItem value="DarkMeet">سواد</MenuItem>
              <MenuItem value="Medicine">دواء</MenuItem>
            </Select>
          </FormControl>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="رقم الفاتورة"
            type="number"
            value={index}
            onChange={(e) =>
              setIndex(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
            disabled={isSubmitting}
            fullWidth
            inputProps={{}}
          />
          <FormControl fullWidth>
            <InputLabel id="farm-label">المزرعة</InputLabel>
            <Select
              labelId="farm-label"
              value={farm}
              label="المزرعة"
              onChange={(e) => setFarm(e.target.value)}
              required
              disabled={isSubmitting}
              sx={{ mr: -1 }}
            >
              <MenuItem value="">اختر المزرعة</MenuItem>
              {farms.map((f) => (
                <MenuItem key={f.$id} value={f.$id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
          <TextField
            style={{ marginLeft: "10px" }}
            label="التاريخ"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isSubmitting}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="التوقيت"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={isSubmitting}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            label="العميل"
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            disabled={isSubmitting}
            fullWidth
          />
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          عناصر الفاتورة
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#c62828" }}>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  المادة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  الوحدة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  الكمية
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  السعر
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  الملفات
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">
                    {type === "Sale" ? (
                      <FormControl fullWidth>
                        <InputLabel id={`meterial-label-${idx}`}>
                          اختر الوزن
                        </InputLabel>
                        <Select
                          labelId={`meterial-label-${idx}`}
                          value={item.meterial}
                          label="اختر الوزن"
                          onChange={(e) =>
                            handleItemChange(idx, "meterial", e.target.value)
                          }
                          required
                          disabled={isSubmitting}
                          sx={{ width: "100px", height: "54px" }}
                        >
                          <MenuItem value="">اختر الوزن</MenuItem>
                          {weightRanges.map((weight) => (
                            <MenuItem key={weight} value={weight}>
                              {weight}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        value={item.meterial}
                        onChange={(e) =>
                          handleItemChange(idx, "meterial", e.target.value)
                        }
                        required
                        disabled={isSubmitting}
                        fullWidth
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(idx, "unit", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": {
                          py: 0.7,
                          height: 40,
                          fontSize: 14,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      // value={item.amount}
                      onChange={(e) =>
                        handleItemChange(idx, "amount", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": {
                          py: 0.7,
                          height: 40,
                          fontSize: 14,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      // value={item.price}
                      onChange={(e) =>
                        handleItemChange(idx, "price", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": {
                          py: 0.7,
                          height: 40,
                          fontSize: 14,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {item.fileName ? (
                        <>
                          <Typography variant="body2" sx={{ mx: 1 }}>
                            {item.fileName}
                          </Typography>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleDeleteItemFile(idx)}
                            disabled={isSubmitting}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <label>
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) =>
                              handleItemChange(idx, "files", e.target.files)
                            }
                            disabled={isSubmitting}
                          />
                          <IconButton
                            size="small"
                            color="primary"
                            component="span"
                            disabled={isSubmitting}
                          >
                            <CloudUploadIcon fontSize="small" />
                          </IconButton>
                        </label>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={2}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            onClick={handleAddItem}
            startIcon={<AddIcon />}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              width: "30%",
              minWidth: 120,
              backgroundColor: "#c62828",
              color: "#fff",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#FFF",
                color: "#c62828",
                borderColor: "#b71c1c",
              },
            }}
          >
            إضافة عنصر
          </Button>
          <Button
            variant="outlined"
            onClick={handleAutoFill}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              width: "30%",
              minWidth: 120,
              color: "#c62828",
              borderColor: "#c62828",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#c62828",
                borderColor: "#b71c1c",
                color: "#fff",
              },
            }}
          >
            تعبئة وهمية
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              width: { xs: "100%", sm: "30%" },
              backgroundColor: "#c62828",
              color: "#fff",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ الفاتورة"}
          </Button>
        </Stack>
      </Box>

      {/* قائمة الفواتير */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        قائمة الفواتير
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#c62828" }}>
            <TableRow>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                رقم الفاتورة
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                المزرعة
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                التاريخ
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                العميل
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                الإجمالي
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                الإجراءات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.$id}>
                <TableCell align="center">{invoice.index}</TableCell>
                <TableCell align="center">
                  {farms.find((f) => f.$id === invoice.farmId)?.name}
                </TableCell>
                <TableCell align="center">{invoice.date}</TableCell>
                <TableCell align="center">{invoice.customer}</TableCell>
                <TableCell align="center">
                  {invoiceItems.reduce(
                    (sum, item) => sum + item.amount * item.price,
                    0
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditInvoiceData(invoice);
                      setShowEditModal(true);
                    }}
                    disabled={isSubmitting}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#c62828" }}
                    onClick={() => {
                      setInvoiceToDelete(invoice);
                      setShowDeleteModal(true);
                    }}
                    disabled={isSubmitting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* مودال نجاح حفظ الفاتورة */}
      <Dialog
        open={showSuccessModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowSuccessModal(false)}
        aria-describedby="success-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: "center",
            p: 3,
            minWidth: { xs: 260, sm: 350 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <CheckCircleOutlineIcon
            sx={{ color: "#43a047", fontSize: 60, mb: 1 }}
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" fontWeight={700} color="#43a047" mb={1}>
            تم حفظ الفاتورة بنجاح!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            id="success-dialog-description"
          >
            يمكنك الآن إضافة فاتورة أخرى أو تعديل الفواتير.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c62828",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
            onClick={() => setShowSuccessModal(false)}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار تأكيد الحذف */}
      <Dialog
        TransitionComponent={Transition}
        sx={{ borderRadius: 8 }}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">تأكيد حذف الفاتورة</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد أنك تريد حذف هذه الفاتورة؟.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDelete} style={{color:'#b71c1c'}} autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* مودال نجاح حذف الفاتورة */}
      <Dialog
        open={showDeleteSuccessModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowDeleteSuccessModal(false)}
        aria-describedby="delete-success-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: "center",
            p: 3,
            minWidth: { xs: 260, sm: 350 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <CheckCircleOutlineIcon
            sx={{ color: "#43a047", fontSize: 60, mb: 1 }}
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" fontWeight={700} color="#43a047" mb={1}>
            تم حذف الفاتورة بنجاح!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            id="delete-success-dialog-description"
          >
            تم حذف الفاتورة ويمكنك الآن متابعة العمل.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c62828",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
            onClick={() => setShowDeleteSuccessModal(false)}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* مودال تعديل الفاتورة */}
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="edit-invoice-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: "center",
            p: 3,
            minWidth: { xs: 260, sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h6" fontWeight={700} color="#c62828">
            تعديل الفاتورة
          </Typography>
        </DialogTitle>
        <DialogContent>
          {editInvoiceData && (
            <Stack spacing={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="edit-type-label">نوع الفاتورة</InputLabel>
                <Select
                  labelId="edit-type-label"
                  value={editInvoiceData.type}
                  label="نوع الفاتورة"
                  onChange={e =>
                    setEditInvoiceData({ ...editInvoiceData, type: e.target.value as InvoiceTypes })
                  }
                >
                  <MenuItem value="Sale">بيض</MenuItem>
                  <MenuItem value="DarkMeet">سواد</MenuItem>
                  <MenuItem value="Medicine">دواء</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="رقم الفاتورة"
                type="number"
                value={editInvoiceData.index}
                onChange={e =>
                  setEditInvoiceData({ ...editInvoiceData, index: Number(e.target.value) })
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="edit-farm-label">المزرعة</InputLabel>
                <Select
                  labelId="edit-farm-label"
                  value={editInvoiceData.farmId}
                  label="المزرعة"
                  onChange={e =>
                    setEditInvoiceData({ ...editInvoiceData, farmId: e.target.value })
                  }
                >
                  {farms.map((f) => (
                    <MenuItem key={f.$id} value={f.$id}>
                      {f.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="التاريخ"
                type="date"
                value={editInvoiceData.date}
                onChange={e =>
                  setEditInvoiceData({ ...editInvoiceData, date: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="التوقيت"
                type="time"
                value={editInvoiceData.time}
                onChange={e =>
                  setEditInvoiceData({ ...editInvoiceData, time: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="العميل"
                value={editInvoiceData.customer}
                onChange={e =>
                  setEditInvoiceData({ ...editInvoiceData, customer: e.target.value })
                }
                fullWidth
              />
              {/* يمكنك إضافة حقول عناصر الفاتورة إذا أردت تعديلها أيضاً */}
              {editInvoiceData.items && editInvoiceData.items.map((item, idx) => (
                <Stack key={idx} direction="row" spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="edit-meterial-label">المادة</InputLabel>
                    <Select
                      labelId="edit-meterial-label"
                      value={editInvoiceData.meterial}
                      label="المادة"
                      onChange={e =>
                        setEditInvoiceData({ ...editInvoiceData, meterial: e.target.value })
                      }
                    >
                      <MenuItem value="">اختر الوزن</MenuItem>
                      {weightRanges.map((weight) => (
                        <MenuItem key={weight} value={weight}>
                          {weight}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="الوحدة"
                    value={editInvoiceData.unit}
                    onChange={e =>
                      setEditInvoiceData({ ...editInvoiceData, unit: e.target.value })
                    }
                    fullWidth
                  />
                  <TextField
                    label="الكمية"
                    type="number"
                    value={editInvoiceData.amount}
                    onChange={e =>
                      setEditInvoiceData({ ...editInvoiceData, amount: Number(e.target.value) })
                    }
                    fullWidth
                  />
                  <TextField
                    label="السعر"
                    type="number"
                    value={editInvoiceData.price}
                    onChange={e =>
                      setEditInvoiceData({ ...editInvoiceData, price: Number(e.target.value) })
                    }
                    fullWidth
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c62828",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
            onClick={() => {
              // هنا ضع منطق حفظ التعديل (استدعاء API أو تحديث الحالة)
              // ثم أغلق المودال
              setShowEditModal(false);
            }}
          >
            حفظ التعديلات
          </Button>
          <Button onClick={() => setShowEditModal(false)}>إلغاء</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
