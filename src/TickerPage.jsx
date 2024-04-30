import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Navbar from './Navbar';
import 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import { Chart } from 'chart.js/auto';
Chart.register(annotationPlugin);


const TickerPage = () => {
    const { ticker } = useParams();
    const location = useLocation(); // To access the router state
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Assume that the year is passed as state in the navigate function from App.jsx
    const selectedYear = location.state?.year; 
    const environment = "dev"
    const apiUrl = environment === "dev" ? "http://127.0.0.1:5000" : "https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app";

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                // Use the selected year in the API call
                const response = await fetch(`${apiUrl}/api/stock/${ticker}?year=${selectedYear}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();

                // Verify that jsonData is an array
                if (!Array.isArray(jsonData)) {
                    console.error('Data received is not an array:', jsonData);
                    throw new Error('Data format is incorrect, expected an array of data points');
                }

                // Map over the array to extract the date and close price
                const labels = jsonData.map(item => new Date(item.date).toLocaleDateString());
                const data = jsonData.map(item => item.close);

                setStockData({
                    labels,
                    datasets: [
                        {
                            label: `${ticker} Stock Price`,
                            data,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }
                    ]
                });
            } catch (e) {
                setError(`Failed to fetch stock data: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (ticker && selectedYear) {
            fetchStockData();
        }
    }, [ticker, selectedYear]); // Add selectedYear as a dependency

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col items-center justify-center min-h-screen">
            {/* <a href="../" className="btn normal-case font-extrabold text-xl sm:text-3xl mb-24">Back to Toolkit</a> */}
                <h1 className="text-3xl font-bold mb-6 text-center">{ticker} Information for {selectedYear}</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && stockData && (
                    <div className="w-full max-w-4xl mx-auto"> {/* Adjust the max-width as needed */}
                        <div className="w-full" style={{ height: '50vh' }}> {/* Adjust the height as needed */}
                            {/* <Line 
                                data={stockData} 
                                options={{
                                    maintainAspectRatio: false, // Change to false to allow custom height
                                    responsive: true,
                                }}
                            /> */}
                            <Line
                                data={stockData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                    annotation: {
                                        annotations: [
                                        {
                                            type: 'line',
                                            scaleID: 'x',
                                            value: '2023-04-01', // Replace with the desired date
                                            borderColor: 'red',
                                            borderWidth: 2,
                                            label: {
                                            content: 'Important Date',
                                            enabled: true,
                                            position: 'start',
                                            },
                                        },
                                        ],
                                    },
                                    },
                                }}
                                />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TickerPage;
