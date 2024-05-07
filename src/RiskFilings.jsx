import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa';


function SECRiskFilings() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [searchTicker, setSearchTicker] = useState('');
    const [sector, setSector] = useState(0);

    const environment = "dev"
    const apiUrl = environment === "dev" ? "http://127.0.0.1:5000" : "https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app";

    const fetchCompanies = async () => {
        
        // e.preventDefault();

        try {
            setFiles([]);
            let fetchEndpoint = `${apiUrl}/get-files?farma=${sector}`
            if (searchTicker != '') {
                fetchEndpoint += `&search=${searchTicker}`;
            }
            console.log(fetchEndpoint);

            
            const response = await fetch(fetchEndpoint);
            const data = await response.json();
            
            console.log(data);
            
            setFiles(data["tickers"]);
        } catch (e) {
            setFiles([]);
        }
    };

    const handleRowClick = (ticker) => {
        navigate(`/ticker/${ticker}`, { state: { title: 'Financial Event Risk Analysis Tool', year: 2024 } });
      };

    const downloadCompany = (ticker, sector) => {
        const downloadUrl = `${apiUrl}/download-csv/?sector=${sector}&ticker=${ticker}`;
        window.open(downloadUrl);
    };
    
    useEffect(() => {
        fetchCompanies();

    }, [searchTicker, sector]);


    return (
        <div>
            <Navbar></Navbar>
            <div className="container text-center mx-auto">
            <p className='mb-6'>
            <h1 className="text-xl font-semibold p-4 mb-2">Download SEC 10-K Risk Filings</h1>
                This page allows you to download the risk section of <b>SEC 10-K</b> documents. <br></br>
                The spreadsheets contain the risk text data over the company's filing history.
            </p>
                <input 
                    placeholder="Stock Ticker" 
                    className="input input-bordered w-48 mt-2 mb-4 mx-2"
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                />
                <select 
                    className="select select-bordered mb-2 mx-2" 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                >
                    <option key="0" value="0">All Sectors</option>
                    <option key="1" value="1">Consumer</option>
                    <option key="2" value="2">Manufacturing</option>
                    <option key="3" value="3">HiTec</option>
                    <option key="4" value="4">Health and Medical</option>
                    <option key="5" value="5">Energy</option>
                    <option key="6" value="6">Other including Finance</option>
                </select>
                <form onSubmit={fetchCompanies} className="mb-4">
                    <button type="submit" className="btn btn-secondary">Search Company Risk Filings</button>
                </form>

                {files.length > 0 && (
                    <div className="p-4 mx-auto">
                      <table className="text-center table w-full mt-4 border-solid border-2 overflow-x-scroll">
                        <thead>
                          <tr className="bg-gray-200">
                            <th>Ticker</th>
                            <th>Farma French Sector</th>
                            <th>View Stock Chart</th>
                            <th>Download Risk Filings</th>
                          </tr>
                        </thead>
                        <tbody>
                            {files.map(function ([ticker, sector]) {
                                return (
                                <tr key={ticker}>
                                    <td>{ticker}</td>
                                    <td>{sector}</td>
                                    <td onClick={() => handleRowClick(ticker)} className='link-secondary'>View {ticker} Stock Chart</td>
                                    <td onClick={() => downloadCompany(ticker, sector)}>
                                        Download CSV <FaFileExcel color="green" className="mx-auto" size={24} />
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                        </table>
                    </div>
                    )}

            </div>
        </div>
    );
}

export default SECRiskFilings;
