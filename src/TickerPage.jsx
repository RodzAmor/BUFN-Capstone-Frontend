import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Navbar from './Navbar';
import 'chart.js/auto';

const TickerPage = () => {
    const { ticker } = useParams();
    const location = useLocation();
    const [stockData, setStockData] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const environment = "dev";
    const apiUrl = environment === "dev" ? "http://127.0.0.1:5000" : "https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app";
    var selectedYear = location.state?.year;
    const [year, setYear] = useState(selectedYear);
    const [yearLabel, setYearLabel] = useState(selectedYear);
    
    const fetchStockData = async (e=null) => {
        if (e != null) {
            e.preventDefault();
        }

        try {
            const response = await fetch(`${apiUrl}/api/stock/${ticker}?year=${year}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();

            if (!Array.isArray(jsonData.historicalData)) {
                throw new Error('Data format is incorrect, expected an array of data points');
            }

            setStockData({
                labels: jsonData.historicalData.map(item => new Date(item.date).toLocaleDateString()),
                datasets: [{
                    label: `${ticker} Stock Price`,
                    data: jsonData.historicalData.map(item => item.close),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            });

            setCompanyInfo({
                fullName: jsonData.companyInfo.fullName,
                revenue: jsonData.companyInfo.revenue,
                ebitda: jsonData.companyInfo.ebitda,
                employees: jsonData.companyInfo.employees,
                headquarters: jsonData.companyInfo.headquarters,
                website: jsonData.companyInfo.website,
                description: jsonData.companyInfo.description
            });

            setYearLabel(year);
        } catch (e) {
            setError(`Failed to fetch stock data: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ticker && selectedYear) {
            fetchStockData();
        }
    }, [ticker, selectedYear]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-5 mt-8">{ticker} Information for {yearLabel}</h1>
                <div className='flex align-middle mb-4'>
                    <input 
                    type="number" 
                    placeholder="Enter Year Here" 
                    className="input input-bordered w-24 mx-2"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        selectedYear = e.target.value;
                    }}
                    />
                    <form onSubmit={fetchStockData} className="mx-2">
                        <button type="submit" className="btn btn-primary">Query Annual Stock Data</button>
                    </form>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && stockData && companyInfo && (
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="text-lg mt-8">
                            <p><strong>Full Name:</strong> {companyInfo.fullName}</p>
                            <p><strong>Revenue:</strong> {companyInfo.revenue ? companyInfo.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}</p>
                            <p><strong>EBITDA:</strong> {companyInfo.ebitda.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                            <p><strong>Total Employees:</strong> {companyInfo.employees ? companyInfo.employees.toLocaleString() : 'N/A'}</p>
                            <p><strong>Headquarters:</strong> {companyInfo.headquarters}</p>
                            <p><strong>Website:</strong> <a href={companyInfo.website} className='link' target="_blank">{companyInfo.website}</a></p>
                        </div>
                        <div className="w-full" style={{ height: '50vh', marginTop: '5vh', marginBottom: '5vh' }}>
                            <Line data={stockData} options={{ maintainAspectRatio: false, responsive: true }}/>
                        </div>
                        <div className="text-lg mt-8">
                            <p><strong>Description:</strong> {companyInfo.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TickerPage;