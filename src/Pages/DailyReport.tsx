import { useEffect, useState } from "react";
import { useSelectedFarmContext } from "../contexts";
import { reportsService } from "../lib/appwrite";
import { Query } from "appwrite";
import DailyReportItem from "../components/DailyReportItem";
import FarmsFilter from "../components/FarmsFilter";
import type { IDailyReport } from "../models";
import '../Pages/styles.css'
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

export default function DailyReport() {
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IDailyReport[]>([]);

  useEffect(() => {
    if (!selectedFarm) return;
    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert("حدث خطأ أثناء جلب التقارير"),
        [Query.equal("farmId", selectedFarm || "")]
      );
    };
    init();
  }, [selectedFarm]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "#fff",
        p: 0,
        m: 0,
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
          التقرير اليومي للإنتاج
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
        <Box sx={{ mt: 1 }}>


        </Box>

        <Box
          sx={{
            mb: { xs: 2, md: 4 },
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FarmsFilter />
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 1300,
            mx: "auto",
            my: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pb: 1,
            px: { xs: 0, md: 2 },
            "&::-webkit-scrollbar": {
              height: "10px",
              background: "#ffcdd2",
              borderRadius: 4,
              display: "block",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c62828",
              borderRadius: 4,
            },
            scrollbarColor: "#c62828 #ffcdd2",
            scrollbarWidth: "thin",
          }}
        >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 24px 0 rgba(198,40,40,0.10)",
              minWidth: { xs: "1200px", md: "900px" },
              background: "rgba(255,255,255,0.98)",
              overflow: "hidden",
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
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                },
                "& tbody td": {
                  textAlign: "center",
                  fontSize: { xs: 10, md: 15 },
                  whiteSpace: "nowrap",
                },
                "& tbody tr:nth-of-type(odd)": { backgroundColor: "#fff5f5" },
                "& tbody tr:hover": { backgroundColor: "#ffeaea" },
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "التاريخ",
                    "التوقيت",
                    "الإنتاج",
                    "الإنتاج المشوه",
                    "الكرتون",
                    "المبيع",
                    "التراكمي",
                    "الإنتاج/البيض",
                    "نسبة الإنتاج",
                    "عدد الفرخة قبل",
                    "النفوق",
                    "عدد الفرخة بعد",
                    "العلف",
                    "نسبة استهلاك العلف",
                    "كمية السواد المنتج",
                  ].map((label, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        p: { xs: 0.5, md: 2 },
                        whiteSpace: "pre-line",
                        fontSize: { xs: 11, md: 16 },
                        borderBottom: "2px solid #fff",
                        textAlign: "center",
                        background: "transparent",
                      }}
                    >
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
                <DailyReportItem dailyReports={reports} />
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

      {/* تحسين العرض على الجوال */}
      <style>
        {`
          @media (max-width: 700px) {
            .MuiTypography-h4 {
              font-size: 20px !important;
              margin-bottom: 8px !important;
              padding: 0 8px;
            }
            .MuiTableContainer-root {
              min-width: 100vw !important;
              box-shadow: none !important;
            }
            .MuiTable-root {
              min-width: 700px !important;
            }
            .MuiTableCell-root {
              font-size: 10px !important;
              padding: 4px !important;
            }
          }
        `}
      </style>
    </Box>
  );
}
