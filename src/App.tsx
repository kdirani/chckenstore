import { Route, Routes } from "react-router-dom";
import "./App.css";
import DailyReport from "./Pages/DailyReport";
import Header from "./layouts/Header";
import Home from "./Pages/Home";
import GlobalReports from "./Pages/GlobalReports";
import { SelectedFarmContext } from "./contexts";
import { useState } from "react";
import GlobalReportsRecord from "./Pages/GlobalReportsRecord";
import InvoiceRecord from "./Pages/InvoiceRecord";
import InvoicesForm from "./components/InvoicesForm";
import { FarmProvider } from "./context/FarmsProvider";
import FarmsForm from "./components/FarmsForm";
import ReportsForm from "./components/ReportsForm";

function App() {
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  return (
    <div>
      <FarmProvider>
        <SelectedFarmContext value={[selectedFarm, setSelectedFarm]}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dailyReport" element={<DailyReport />} />
            <Route path="/globalReport" element={<GlobalReports />} />
            <Route
              path="/globalReportRecord"
              element={<GlobalReportsRecord />}
            />
            <Route path="/invoice" element={<InvoiceRecord />} />
            <Route path="/invoice/new" element={<InvoicesForm />} />
            <Route path="/addfarm" element={<FarmsForm />} />
            <Route path="/addreport" element={<ReportsForm />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </SelectedFarmContext>
      </FarmProvider>
    </div>
  );
}

export default App;
