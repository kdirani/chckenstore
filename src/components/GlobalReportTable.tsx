import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import {
  filterReportsBeforeDate,
  filterReportsByPeriod,
  getAvarageOfDeath,
  getAvarageOfFoodProductionPercentage,
  getCheckenAmountBefore,
  getEndDate,
  getPreviousCumulative,
  getPreviousReportByFarm,
  getStartDate,
  totalize,
} from "../utils";
import { useSelectedFarmContext } from "../contexts";
import type { FilterDateMod } from "../models";
import type { IDailyReport } from "../models";

interface GlobalReportTableProps {
  dateMode: FilterDateMod;
  reports: IDailyReport[];
}

export default function GlobalReportTable({
  dateMode,
  reports,
}: GlobalReportTableProps) {
  const selectedFarm = useSelectedFarmContext()[0];
  const currentReports = reports.filter(
    (report) => report.farmId === selectedFarm
  );
  const previousReport = getPreviousReportByFarm(
    currentReports,
    selectedFarm || "",
    new Date()
  );

  if (!currentReports || currentReports.length === 0) {
    return <div>لا توجد تقارير متاحة</div>;
  }

  const filteredReports = filterReportsByPeriod(currentReports, dateMode);
  if (!filteredReports || filteredReports.length === 0) {
    return <div>لا توجد تقارير متاحة للفترة المحددة</div>;
  }

  const startDate = getStartDate(new Date(), dateMode);
  const endDate = getEndDate(new Date(), dateMode);
  const previousCumulative = previousReport
    ? getPreviousCumulative(
        previousReport,
        filterReportsBeforeDate(currentReports, startDate)
      )
    : 0;
  const totalProduction = totalize(filteredReports, "production").amount;
  const totalSales = totalize(filteredReports, "sale").amount;
  const currentCumulative = getPreviousCumulative(
    filteredReports[filteredReports.length - 1],
    filterReportsBeforeDate(currentReports, endDate)
  );
  const startingChickenCount = getCheckenAmountBefore(
    filteredReports[0],
    undefined,
    currentReports
  );
  const totalDeaths = totalize(filteredReports, "death").amount;
  const endingChickenCount = startingChickenCount - totalDeaths;
  const avgDeath = getAvarageOfDeath(filteredReports, dateMode);
  const totalFood = totalize(filteredReports, "dailyFood").amount;
  const daysInPeriod = dateMode === "day" ? 1 : dateMode === "week" ? 7 : 30;
  const avgFoodPerChicken = getAvarageOfFoodProductionPercentage(
    filteredReports,
    dateMode,
    "food"
  );
  const avgEggProduction = getAvarageOfFoodProductionPercentage(
    filteredReports,
    dateMode,
    "production"
  );
  const totalDarkMeat = totalize(filteredReports, "darkMeat").amount;

  return (
    <div style={{ width: "100%", overflowX: "auto", marginBottom: 24 }}>
      <h2
        style={{
          color: "#c62828",
          fontWeight: "bold",
          fontSize: 22,
          margin: "16px 0 12px 0",
          textAlign: "center",
        }}
      >
        {dateMode === "day"
          ? "تقرير يومي"
          : dateMode === "week"
          ? "تقرير أسبوعي"
          : "تقرير شهري"}
      </h2>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          // overflow: "hidden", // important for rounded corners!
          boxShadow: "0 2px 12px 0 rgba(198,40,40,0.07)",
          mb: 3,
        }}
      >
        <Table
          sx={{
            minWidth: 900,
            "& thead tr": {
              background: "#b71c1c", // لون أحمر غامق للرأس
            },
            "& thead th": {
              color: "#fff",
              fontWeight: "bold",
              fontSize: { xs: 11, md: 16 },
              borderBottom: "2px solid #fff",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              background: "transparent", // احذف هذا السطر إذا أردت اللون يظهر
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                تاريخ البداية
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                تاريخ النهاية
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                الرصيد التراكمي السابق
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                كمية الإنتاج
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                كمية المبيعات
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                الرصيد التراكمي الحالي
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                عدد الفرخة بداية الفلترة
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                عدد النفوق ضمن فترة الفلترة
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                عدد الفرخة نهاية الفلترة
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                متوسط النفوق
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                كمية العلف المستهلك
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                عدد الأيام
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                متوسط استهلاك الفرخة من العلف
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                متوسط إنتاج البيض
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap", // يمنع الكسر
                  overflow: "hidden",
                  textOverflow: "ellipsis", // إذا كان طويل جداً يظهر ...
                  fontWeight: "bold",
                  color: "#fff",
                  p: { xs: 0.5, md: 2 },
                  fontSize: { xs: 11, md: 16 },
                  borderBottom: "2px solid #fff",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                كمية السواد المنتج
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{startDate.toLocaleDateString()}</TableCell>
              <TableCell>{endDate.toLocaleDateString()}</TableCell>
              <TableCell>{previousCumulative}</TableCell>
              <TableCell>{totalProduction}</TableCell>
              <TableCell>{totalSales}</TableCell>
              <TableCell>{currentCumulative}</TableCell>
              <TableCell>{startingChickenCount}</TableCell>
              <TableCell>{totalDeaths}</TableCell>
              <TableCell>{endingChickenCount}</TableCell>
              <TableCell>{avgDeath}</TableCell>
              <TableCell>{totalFood}</TableCell>
              <TableCell>{daysInPeriod}</TableCell>
              <TableCell>{avgFoodPerChicken}</TableCell>
              <TableCell>{avgEggProduction}</TableCell>
              <TableCell>{totalDarkMeat}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
