import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TickerPage from './TickerPage'; // Ensure you import TickerPage

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ticker/:ticker" element={<TickerPage />} /> {/* Add this line */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
