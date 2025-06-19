import { useEffect, useState } from "react";
import FarmsFilter from "../components/FarmsFilter";
import { useFarms, useSelectedFarmContext } from "../contexts";
import type { IInvoice, InvoiceTypes, IRecursiveInvoice } from "../models";
import { fileService, invoiceService } from "../lib/appwrite";
import { Query } from "appwrite";
import {
  Box,
  Typography,
  Divider,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";

type FileMeta = {
  fid: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
};

export default function InvoiceRecord() {
  const selectedFarm = useSelectedFarmContext()[0];
  const farms = useFarms().farms;
  const [type, setType] = useState<InvoiceTypes>("Sale");
  const [invoices, setInvoices] = useState<IRecursiveInvoice[]>([]);
  const [fileMetasMap, setFileMetasMap] = useState<Record<string, FileMeta[]>>({});

  useEffect(() => {
    if (!selectedFarm) return;
    invoiceService.list(
      (docs) => setInvoices(docs),
      () => alert("Error fetching invoices"),
      [Query.equal("farmId", selectedFarm), Query.equal("type", type)]
    );
  }, [selectedFarm, type]);

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
            console.error("Failed fetching file meta for", fid, err);
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
    <Box sx={{ width: "100%", bgcolor: "#fff", minHeight: "100vh", pb: 4 }}>
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#c62828"
          sx={{ mb: 1, fontSize: { xs: 18, sm: 25 } }}
        >
          سجل الفواتير
        </Typography>
        <Divider
          sx={{
            backgroundColor: "#c62828",
            height: "2px",
            width: { xs: "90%", sm: "80%" },
            mx: "auto",
            mb: 3,
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box sx={{ minWidth: 160 }}>
            <FarmsFilter />
          </Box>
          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              bgcolor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderColor: "#c62828",
                color: "#c62828",
                fontWeight: "bold",
                marginRight: 2,
              },
            }}
          >
            <InputLabel id="invoice-type-label" sx={{ color: "#c62828" }}>
              نوع المادة
            </InputLabel>
            <Select
              labelId="invoice-type-label"
              value={type}
              label="نوع المادة"
              onChange={(e) => setType(e.target.value as InvoiceTypes)}
              sx={{
                color: "#c62828",
                fontWeight: "bold",
                borderRadius: 1,
                
                "& .MuiSelect-icon": { color: "#c62828" },
              }}
            >
              <MenuItem value="Sale">بيض</MenuItem>
              <MenuItem value="DarkMeet">سواد</MenuItem>
              <MenuItem value="Medicine">دواء</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 3,
            maxWidth: "100vw",
            minWidth: 900,
            mx: "auto",
            mt: 2,
            boxShadow: "0 4px 24px 0 rgba(198,40,40,0.10)",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={headCellStyle}>
                  رقم تقرير الإدخال
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  الرقم التسلسلي
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  التاريخ
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  التوقيت
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  الكمية
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  السعر
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  المبلغ
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  الوحدة
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  {type === "Medicine" ? "المادة" : "الوزن"}
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  الزبون
                </TableCell>
                <TableCell align="center" sx={headCellStyle}>
                  التوثيق
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, idx) => (
                <InvoiceTableRow
                  key={invoice.$id}
                  invoiceType={type}
                  invoice={invoice}
                  index={idx}
                  farmName={
                    farms.find((f) => f.$id === invoice.farmId)?.name || "غير معروف"
                  }
                  fileMetas={fileMetasMap[invoice.$id] || []}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

const headCellStyle = {
  background: "#c62828",
  color: "#fff",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: { xs: 13, sm: 15 },
  border: "none",
  px: 1,
  py: 1.5,
};

function InvoiceTableRow(props: {
  invoiceType: InvoiceTypes;
  invoice: IInvoice;
  index: number;
  farmName: string;
  fileMetas: FileMeta[];
}) {
  const { invoice, index, invoiceType, farmName, fileMetas } = props;
  const total = invoice.amount * invoice.price;

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd) td": { background: "#fff6f6" },
        "&:nth-of-type(even) td": { background: "#fff" },
      }}
    >
      <TableCell align="center">{invoice.index}</TableCell>
      <TableCell align="center">{index}</TableCell>
      <TableCell align="center">{invoice.date}</TableCell>
      <TableCell align="center">{invoice.time}</TableCell>
      <TableCell align="center">{invoice.amount}</TableCell>
      <TableCell align="center">{invoice.price}</TableCell>
      <TableCell align="center">{total}</TableCell>
      <TableCell align="center">{invoice.unit}</TableCell>
      <TableCell align="center">
        {invoiceType === "Medicine" ? farmName : invoice.meterial}
      </TableCell>
      <TableCell align="center">
        {invoiceType === "Medicine" ? invoice.meterial : invoice.customer}
      </TableCell>
      <TableCell align="center">
        {fileMetas.length === 0 && <span>—</span>}
        {fileMetas.map(({ fid, previewUrl, downloadUrl, mimeType }) => {
          const isImage = mimeType.startsWith("image/");
          return (
            <Box key={fid} sx={{ mb: 1 }}>
              {isImage && (
                <img
                  src={`https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_FILE_BUCKET_ID}/files/${fid}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                  alt="preview"
                  style={{
                    maxWidth: 80,
                    maxHeight: 80,
                    display: "block",
                    marginBottom: 4,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #eee",
                  }}
                  loading="lazy"
                />
              )}
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#c62828",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  fontSize: 14,
                }}
              >
                {isImage ? "تحميل الصورة" : "تحميل الملف"}
              </a>
            </Box>
          );
        })}
      </TableCell>
    </TableRow>
  );
}
