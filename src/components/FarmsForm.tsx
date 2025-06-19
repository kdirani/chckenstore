import { useState, type ChangeEvent, type FormEvent } from "react";
import React from "react";
import Stack from "@mui/material/Stack";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { TransitionProps } from "@mui/material/transitions";
import type { IRecursiveFarm } from "../models";
import { farmsService } from "../lib/appwrite";
import { useFarms } from "../contexts";
import IconButton from "@mui/material/IconButton";

export interface IFarm {
  name: string;
  initialChecken: number;
}

// إضافة ترانزيشن جميل للمودال
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function FarmsForm() {
  const { farms, loading } = useFarms();

  const [name, setName] = useState("");
  const [initialChecken, setInitialChecken] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<IRecursiveFarm | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const resetForm = () => {
    setName("");
    setInitialChecken("");
    setCurrentFarmId(null);
    setEditMode(false);
  };

  const loadFarmForEdit = (farm: IRecursiveFarm) => {
    setName(farm.name);
    setInitialChecken(farm.initialChecken);
    setCurrentFarmId(farm.$id);
    setEditMode(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const farmData: IFarm = {
      name,
      initialChecken: Number(initialChecken),
    };

    if (editMode && currentFarmId) {
      farmsService.update(
        currentFarmId,
        farmData,
        () => {
          resetForm();
          setIsSubmitting(false);
          setShowSuccessModal(true); // عرض المودال عند التحديث
        },
        () => {
          setIsSubmitting(false);
          alert("حدث خطأ أثناء تحديث المزرعة. حاول مرة أخرى.");
        }
      );
    } else {
      farmsService.create(
        farmData,
        (newId) => {
          resetForm();
          setIsSubmitting(false);
          setShowSuccessModal(true); // عرض المودال عند الحفظ
        },
        () => {
          setIsSubmitting(false);
          alert("حدث خطأ أثناء حفظ المزرعة. حاول مرة أخرى.");
        }
      );
    }
  };

  const confirmDelete = () => {
    if (farmToDelete) {
      farmsService.delete(farmToDelete.$id, () => {
        setShowDeleteModal(false);
        setFarmToDelete(null);
        alert("تم حذف المزرعة بنجاح");
      });
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <AddHomeWorkIcon sx={{ color: "#c62828", fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700} color="#c62828">
          {editMode ? "تعديل المزرعة" : "إضافة مزرعة جديدة"}
        </Typography>
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="اسم المزرعة"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="أدخل اسم المزرعة"
                required
                fullWidth
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="عدد الدجاج الابتدائي"
                type="number"
                value={initialChecken}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInitialChecken(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="أدخل عدد الدجاج"
                required
                fullWidth
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#c62828",
                    "&:hover": { backgroundColor: "#b71c1c" },
                  }}
                >
                  {isSubmitting
                    ? "جاري الحفظ..."
                    : editMode
                    ? "تحديث المزرعة"
                    : "حفظ المزرعة"}
                </Button>
                {editMode && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                  >
                    إلغاء التعديل
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight={700} mb={2} color="#c62828">
        قائمة المزارع
      </Typography>
      {loading ? (
        <Typography>جاري تحميل البيانات...</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ background: "#c62828", color: "#fff", fontWeight: 700 }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ background: "#c62828", color: "#fff", fontWeight: 700 }}>
                  اسم المزرعة
                </TableCell>
                <TableCell align="center" sx={{ background: "#c62828", color: "#fff", fontWeight: 700 }}>
                  عدد الدجاج الابتدائي
                </TableCell>
                <TableCell align="center" sx={{ background: "#c62828", color: "#fff", fontWeight: 700 }}>
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    لا توجد مزارع مسجلة
                  </TableCell>
                </TableRow>
              ) : (
                farms.map((farm, index) => (
                  <TableRow key={farm.$id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{farm.name}</TableCell>
                    <TableCell align="center">{farm.initialChecken}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => loadFarmForEdit(farm)}
                        sx={{
                          color: "#1976d2",
                          mx: 0.5,
                          background: "#f0f4ff",
                          "&:hover": { background: "#e3eaff" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          setFarmToDelete(farm);
                          setShowDeleteModal(true);
                        }}
                        sx={{
                          color: "#c62828",
                          mx: 0.5,
                          background: "#fff0f0",
                          "&:hover": { background: "#ffeaea" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          هل أنت متأكد من حذف المزرعة "{farmToDelete?.name}"؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={confirmDelete} color="error">
            تأكيد الحذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* مودال نجاح الحفظ */}
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
          <CheckCircleOutlineIcon sx={{ color: "#43a047", fontSize: 60, mb: 1 }} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" fontWeight={700} color="#43a047" mb={1}>
            تم حفظ المزرعة بنجاح!
          </Typography>
          <Typography variant="body2" color="text.secondary" id="success-dialog-description">
            يمكنك الآن إضافة مزرعة أخرى أو تعديل المزارع.
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
    </Box>
  );
}
