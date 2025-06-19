import { useEffect, useState } from "react";
import FarmsFilter from "../components/FarmsFilter";
import GlobalReportTable from "../components/GlobalReportTable";
import { useSelectedFarmContext } from "../contexts";
import { reportsService } from "../lib/appwrite";
import { Query } from "appwrite";
import type { IDailyReport } from "../models";
import "../Pages/styles.css";
import {
  Typography,
  Box,
  Divider,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";

export default function GlobalReports() {
  const selectedFarm = useSelectedFarmContext()[0];
  const [reports, setReports] = useState<IDailyReport[]>([]);
  const theme = useTheme();

  useEffect(() => {
    if (!selectedFarm) return;
    const init = async () => {
      reportsService.list(
        (docs) => setReports(docs),
        () => alert("Error in reports fetch"),
        [Query.equal("farmId", selectedFarm)]
      );
    };
    init();
  }, [selectedFarm]);

  const tableContainerSx = {
    overflowX: "auto",
    width: "100vw",
    mb: 3,
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
  };

  const commonTableStyles = {
    minWidth: 900,
    "& thead tr": {
      background: "#c62828",
    },
    "& thead th": {
      color: "#fff",
      fontWeight: "bold",
      fontSize: { xs: 13, md: 16 },
      borderBottom: "2px solid #ffcdd2",
      textAlign: "center",
      whiteSpace: "nowrap",
    },
    "& tbody td": {
      textAlign: "center",
      fontSize: { xs: 12, md: 15 },
      whiteSpace: "nowrap",
    },
    "& tbody tr:nth-of-type(odd)": { backgroundColor: "#fff5f5" },
    "& tbody tr:hover": { backgroundColor: "#ffeaea" },
    borderRadius: 3,
    boxShadow: "0 2px 12px 0 rgba(198,40,40,0.07)",
  };

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
          تقرير الإنتاج اليومي الشامل
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
            mb: { xs: 2, md: 4 },
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FarmsFilter />
        </Box>

        <Box sx={tableContainerSx}>
          <GlobalReportTable dateMode="day" reports={reports} tableSx={commonTableStyles} />
        </Box>

        <Box sx={tableContainerSx}>
          <GlobalReportTable dateMode="week" reports={reports} tableSx={commonTableStyles} />
        </Box>

        <Box sx={tableContainerSx}>
          <GlobalReportTable dateMode="month" reports={reports} tableSx={commonTableStyles} />
        </Box>
      </Stack>

      {/* CSS للتجاوب وظهور شريط التمرير دائماً */}
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
              font-size: 11px !important;
              padding: 4px !important;
            }
          }
        `}
      </style>
    </Box>
  );
}
