import { useEffect, useMemo, useState } from "react";
import FarmsFilter from "../components/FarmsFilter";
import { useSelectedFarmContext } from "../contexts";
import type { FilterDateMod, IDailyReport } from "../models";
import { groupReportsByPeriod } from "../utils";
import GlobalReportsRecordItem from "../components/GlobalReportsRecordItem";
import { reportsService } from "../lib/appwrite";
import { Query } from "appwrite";
import "../Pages/styles.css";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
} from "@mui/material";

export default function GlobalReportsRecord() {
  const [dateMode, setDateMode] = useState<FilterDateMod>("day");
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IDailyReport[]>([]);

  useEffect(() => {
    if (!selectedFarm) return;
    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert("Error in reports fetch"),
        [Query.equal("farmId", selectedFarm || "")]
      );
    };
    init();
  }, [selectedFarm]);

  const groupedReports = useMemo(() => {
    if (!reports || reports.length === 0) {
      return [];
    }
    return groupReportsByPeriod(reports, dateMode);
  }, [reports, dateMode]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          minHeight: "100vh",
          width: "100vw",
          pt: 5,
          pb: 5,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#c62828",
            letterSpacing: 1,
            mb: 1,
            fontSize: { xs: 22, md: 32 },
            fontFamily: `'IBM Plex Sans Arabic', 'Ancizar Sans', Arial, sans-serif`,
          }}
        >
          سجل التقارير الشاملة
        </Typography>

        <Divider
          sx={{
            my: { xs: 1, md: 3 },
            borderColor: "#c62828",
            borderBottomWidth: 3,
            width: "90vw",
            maxWidth: 1200,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <FarmsFilter />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="date-mode-label">نوع التقرير</InputLabel>
            <Select
              labelId="date-mode-label"
              value={dateMode}
              label="نوع التقرير"
              onChange={(e) => setDateMode(e.target.value as FilterDateMod)}
            >
              <MenuItem value="day">يومي</MenuItem>
              <MenuItem value="week">أسبوعي</MenuItem>
              <MenuItem value="month">شهري</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 1, md: 2 },
            mb: 3,
          }}
        >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 24px 0 rgba(198,40,40,0.10)",
              background: "rgba(255,255,255,0.98)",
              width: "100%",
              minWidth: 0,
              display: "flex",

            }}
          >
            <Table
              sx={{
                minWidth: 1200,
                "& thead tr": {
                  background: "#c62828",
                },
                "& thead th": {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: { xs: 12, md: 15 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                },
                "& tbody td": {
                  textAlign: "center",
                  fontSize: { xs: 11, md: 14 },
                  transition: "background 0.3s",
                },
                "& tbody tr:nth-of-type(odd)": { backgroundColor: "#fff5f5" },
                "& tbody tr:nth-of-type(even)": { backgroundColor: "#fff" },
                "& tbody tr:hover": { backgroundColor: "#ffeaea" },
              }}
            >
              <TableHead>
                <TableRow>
                  { [
                    "تاريخ البداية",
                    "تاريخ النهاية",
                    "الرصيد التراكمي السابق",
                    "كمية الإنتاج",
                    "كمية المبيعات",
                    "الرصيد التراكمي الحالي",
                    "عدد الفرخة بداية الفلترة",
                    "عدد النفوق ضمن فترة الفلترة",
                    "عدد الفرخة نهاية الفلترة",
                    "متوسط النفوق",
                    "كمية العلف المستهلك",
                    "عدد الأيام",
                    "متوسط استهلاك الفرخة من العلف",
                    "كمية السواد المنتج",
                    "متوسط إنتاج البيض",
                  ].map((label, idx) => (
                    <TableCell key={idx}>
                      {label.includes(" ") ? (
                        label.split(" ").map((word, i, arr) => (
                          <span key={i}>
                            {word}
                            {i !== arr.length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length > 0 ? (
                  groupedReports.map((group, index) => (
                    <GlobalReportsRecordItem
                      key={index}
                      currentReports={reports}
                      groupReports={group.reports}
                      periodStart={group.periodStart}
                      periodEnd={group.periodEnd}
                      dateMode={dateMode}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} align="center">
                      لا توجد تقارير متاحة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
          <button
          onClick={() => window.print()}
          style={{
            background: "#c62828",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            // marginLeft: "75rem",
          }}
        >
          طباعة التقرير
        </button>
      </Stack>
    </Box>
  );
}
