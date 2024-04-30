import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TickerPage from './TickerPage';
import SECRiskFilings from './RiskFilings';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ticker/:ticker" element={<TickerPage />} />
        <Route path="/sec-risk-filings" element={<SECRiskFilings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
