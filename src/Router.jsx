import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TickerPage from './TickerPage';
import RiskFilings from './RiskFilings';
import KnowledgeGraph from './KnowledgeGraph';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ticker/:ticker" element={<TickerPage />} />
        <Route path="/sec-risk-filings" element={<RiskFilings />} />
        <Route path="/KnowledgeGraph" element={<KnowledgeGraph />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
