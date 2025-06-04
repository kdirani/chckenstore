import { Route, Routes } from 'react-router-dom';
import './App.css';
import DailyReport from './Pages/DailyReport';
import Header from './layouts/Header';
import Home from './Pages/Home';
import GlobalReports from './Pages/GlobalReports';
import { SelectedFarmContext } from './contexts';
import { mockDailyReports } from './mockData';
import { useState } from 'react';
import GlobalReportsRecord from './Pages/GlobalReportsRecord';
import InvoiceRecord from './Pages/InvoiceRecord';

function App() {
  const [selectedFarm, setSelectedFarm] = useState<string | null>(mockDailyReports[0].farm); 
  
  return (
    <div>
      <SelectedFarmContext value={[selectedFarm, setSelectedFarm]}>
        <Header />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/dailyReport' element={<DailyReport />} />
          <Route path='/globalReport' element={<GlobalReports />} />
          <Route path='/globalReportRecord' element={<GlobalReportsRecord />} />
          <Route path='/invoice' element={<InvoiceRecord />} />
          <Route path='*' element={<h1>Not found</h1>}/>
        </Routes>
      </SelectedFarmContext>
    </div>
  );
}

export default App;
