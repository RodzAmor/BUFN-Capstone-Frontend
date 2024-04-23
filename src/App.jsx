import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';



function App() {
  const navigate = useNavigate();
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // State to track the selected row index
  // Other states and functions...

  const handleRowClick = (index, ticker) => {
    setSelectedRowIndex(index); // Set the selected row index
    navigate(`/ticker/${ticker}`, { state: { title: 'Financial Event Risk Analysis Tool', year: year } });
  };
  
  const [exampleHeadlines, setExampleHeadlines] = useState([
  "U.S. Approves $1.5 Billion Loan to Restart Michigan Nuclear Plant",
  "Biden Plans Sweeping Effort to Block Arctic Oil Drilling",
  "Jobs Report Looms What's Next for Energy Transfer Stock and Its 8% Dividend Yield?",
  "IEA Expects Global Oil-Demand Growth to Slow Further in 2025",
  "Environmentalists protest as Biden administration approves huge oil export terminal off Texas coast",,
  "Driven by China, Coal Plants Made a Comeback in 2023",
  "Energy Dept. Awards $6 Billion for Green Steel, Cement and Even Macaroni Factories",
  "U.S. Seeks to Boost Nuclear Power After Decades of Inertia",
  "With inflation stalling, the long-predicted storm clouds in the economy may actually be forming"]);

  const [year, setYear] = useState(2024);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isAnalyzing, setIsAnalyzing] = useState(false); // State to track loading status
  const [analyzingCompany, setAnalyzingCompany] = useState(''); // State to track loading status
  const environment = "dev"

  const fetchExampleData = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading


    const fetchEndpoint = environment === "dev" ? `http://127.0.0.1:5000/example` : "https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app/example";
    fetch(fetchEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const parsedData = JSON.parse(data.data);
      setTableData(parsedData);
      setError('');
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    })
    .finally(() => setIsLoading(false));
  }
  
  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://gnews.io/api/v4/top-headlines?q=energy+sector&category=business&token=ae289a4a0a662da6d2aee99dfe8a9a43&lang=en&country=us');
      // const response = "";
      if (!response.ok) {
        throw new Error('Failed to fetch headlines');
      }
      const data = await response.json();
      setExampleHeadlines(data.articles.map(article => article.title));
      data.articles.forEach(article => {
        console.log(article.title)
      });
    } catch (error) {
      // setError('Failed to load headlines. API key has run out of available calls.');
      // console.error('API key has run out of available calls. Error fetching headlines:', error);
      // console.log("It will be prefilled with data.")
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setTableData([]);
    if (!headline) {
      setError('Headline is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const ticker = ["XOM", "PXD", "ETR", "ED", "PCG", "OSG"];
    try {
      for (const tickerSymbol of ticker) {
        setAnalyzingCompany(tickerSymbol);
        setIsAnalyzing(true);
        const fetchEndpoint = environment === "dev" ? `http://127.0.0.1:5000/analyze-company?ticker=${tickerSymbol}&year=${year}&headline=${headline}` 
        : `https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app/analyze-company?ticker=${tickerSymbol}&year=${year}&headline=${headline}`;
        const response = await fetch(fetchEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ticker ${tickerSymbol}`);
        }
        const data = await response.json();
        
        
        const newEntry = {
          Ticker: data[0]["Ticker"],
          "Company Name": data[0]["Company Name"],
          "Fill Date": data[0]["Fill Date"],
          Year: data[0]["Year"],
          "Headline": headline,
          "Highest Semantic Similarity": data[0]["Highest Similarity Score"],
          "Risk Section Representative Segment": data[0]["Risk Section Representative Segment"],
        };
        setTableData(prevData => [...prevData, newEntry]);
        setIsLoading(false);
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
    } finally {
      // setIsLoading(false);
    }
  };


  const handleDownloadCSV = () => {
    if (tableData.length === 0) {
      setError('No data available to download');
      return;
    }

    const csvContent = generateCSV(tableData);
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);

    // Create a temporary <a> element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.download = 'financial_data.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(csvUrl);
  };

  const generateCSV = (data) => {
    const csvRows = [];
    // Header row
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const escapedValue = ('"' + row[header] + '"').replace(/"/g, '""');
        return escapedValue;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  
  return (
    <div className="App">
      <div className="navbar bg-slate-200 p-3 mb-2">
            <div className="navbar-start">
            </div>
            <div className="navbar-center">
                <a href="" className="btn btn-ghost normal-case font-extrabold text-xl sm:text-3xl">Financial Event Risk Analysis Tool</a>
            </div>
            <div className="navbar-end">
            </div>
        </div>
      <header className="App-header"></header>
      <div className="container text-center mx-auto">
        <h1 className="text-xl font-semibold p-4 mb-2">Event Semantic Similarity Analysis With Company SEC 10-K Risk Factors</h1>
        <p className='mb-6'>
          This toolkit will analyze if a company has listed concerns related to the event in the risk section of their SEC 10-K. <br></br>
          Enter a news headline or label representing an <b>event</b> or select a top news headline below:
        </p>
        {/* Form for ticker and year input */}
        <form className="mb-4 flex flex-col sm:flex-row items-center mx-auto" >
          <div className="flex flex-col items-center sm:items-end w-1/2 p-4">
            <select 
                className="select select-bordered mb-2 w-96" 
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              >
                <option value="">Select a current news headline or type one below</option>
                {exampleHeadlines.map((line, index) => (
                  <option key={index} value={line}>{line}</option>
                ))}
            </select>
            <textarea 
              type="text" 
              placeholder="Enter Headline Here" 
              className="input input-bordered h-24 w-96" 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)} // Convert ticker to uppercase
            />
          </div>
          <div className="flex flex-col items-center sm:items-start align-middle w-1/2 p-4">
            <p className='inline w-48'>Annual Report Year</p>
            <input 
              type="number" 
              placeholder="Enter Year Here" 
              className="input input-bordered w-48 mt-2 mb-4"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button type="button" className="btn btn-primary w-48" onClick={fetchData}>Analyze Headline</button>
          </div>
        </form>
        <form onSubmit={fetchExampleData} className="mb-4">
          <button type="submit" className="btn btn-secondary">Show Example Output</button>
        </form>

        {!isLoading && tableData.length > 0 && (
          <div className="p-4 mx-auto">
            <table className="text-center table w-full mt-4 border-solid border-2 overflow-x-scroll">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} 
                      onClick={() => handleRowClick(index, row['Ticker'])}
                      className={selectedRowIndex === index ? "selected-row" : ""}
                  >
                    {Object.values(row).map((value, valueIndex) => (
                      <td key={valueIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {isAnalyzing && <p className='m-2'>Analyzing: {analyzingCompany}...</p>}
          </div>
        )}
        {/* Button to download CSV */}
        {!isLoading && tableData.length > 0 && (
          <div className="mt-4 mb-4 text-center"> {/* Added mb-4 for margin bottom */}
          <button type="button" className="btn btn-primary w-48" onClick={handleDownloadCSV}>
            Download Data as CSV
          </button>
        </div>
        )}
      
      {isLoading && <p>Processing Headline...</p>}
      {error && <p className="text-red-500">{error}</p>}
      

        <div>
      </div>
      </div>
    </div>
  );
}
export default App;


// docker build -t finance-toolkit-api .
// docker buildx build --platform linux/amd64 -t finance-toolkit-api .
// docker tag finance-toolkit-api gcr.io/bufn-capstone/finance-toolkit-api:latest
// docker push gcr.io/bufn-capstone/finance-toolkit-api:latest
// gcloud run deploy finance-toolkit-api --image gcr.io/bufn-capstone/finance-toolkit-api:latest --platform managed --allow-unauthenticated

// docker run --rm -p 8080:8080 finance-toolkit-api
// docker image inspect finance-toolkit-api