import React, { useState } from 'react';
import './index.css';

function App() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [headline, setHeadline] = useState('');
  const [year, setYear] = useState(2024);
  const [modelName, setModelName] = useState('all-MiniLM-L6-v2'); // Default model
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const fetchData = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!headline) {
      setError('Headline is required');
      setIsLoading(false);
      return;
    }
    
    // fetch(`https://capstonewebapi.azurewebsites.net/analyze?year=${year}&model_name=${modelName}`)
    // fetch(`http://127.0.0.1:5000/analyze?year=${year}&headline=${headline}`)
    fetch(`https://capstonewebapi.azurewebsites.net/analyze?year=${year}&headline=${headline}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.data)
        const parsedData = JSON.parse(data.data);
        setTableData(parsedData);
        setError(''); // Clear any existing errors
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      })
      .finally(() => setIsLoading(false)); // Stop loading regardless of the result
  };

  const fetchExampleData = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading

    // fetch(`https://capstonewebapi.azurewebsites.net/example`)
    // console.log("http://127.0.0.1:5000/example")
    fetch(`https://capstonewebapi.azurewebsites.net/example`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const parsedData = JSON.parse(data.data);
      setTableData(parsedData);
      setError(''); // Clear any existing errors
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    })
    .finally(() => setIsLoading(false)); // Stop loading regardless of the result
  }

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container text-center p-4 mx-auto">
        <h1 className="text-3xl font-bold m-4">Financial Event Risk Analysis Tool</h1>
        
        {/* Form for input */}
        <form onSubmit={fetchData} className="mb-4">
          <input 
            type="text" 
            placeholder="Enter Headline Here" 
            className="input input-bordered w-full max-w-xs mr-2"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Enter Year Here" 
            className="input input-bordered w-24 max-w-xs mr-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <select 
            className="select select-bordered max-w-xs mr-2"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          >
            <option value="all-MiniLM-L6-v2">Small</option>
            <option value="all-MiniLM-L12-v2">Medium</option>
            <option value="all-roberta-large-v1">Large</option>
          </select>
          <button type="submit" className="btn btn-primary">Analyze Headline</button>
        </form>

        <form onSubmit={fetchExampleData} className="mb-4">
          <button type="submit" className="btn btn-secondary">Show Example Headline</button>
        </form>

        {/* Loading indicator */}
        {isLoading && <div className="loader">Loading...</div>}

        {/* Display error message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Table to display data */}
        {!isLoading && tableData.length > 0 && (
          <div className="p mx-auto">
            <table className="text-center table w-full mt-4 border-solid border-2">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, valueIndex) => (
                      <td key={valueIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
