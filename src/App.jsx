import { useState, useEffect } from 'react';
import './index.css';
// import * as tf from '@tensorflow/tfjs';


// let model;

// const loadModel = async () => {
//   const use = require('@tensorflow-models/universal-sentence-encoder');
//   // model = await use.load();
//   model = await use.loadLite();
//   console.log('Model loaded');
//   return model;
// };

// const encodeText = async (model, texts) => {
//   return await model.embed(texts);
// };


// const cosineSimilarity = (a, b) => {
//   console.log('Shape of a:', a.shape);  // Debugging the shape of tensor 'a'
//   console.log('Shape of b:', b.shape);  // Debugging the shape of tensor 'b'

//   // Expand 'a' to 2D if it is 1D and normalize
//   const a2D = a.shape.length === 1 ? a.expandDims(0) : a;
//   const normA = tf.norm(a2D, 'euclidean', 1, true);  // Keepdims to maintain 2D shape
//   const normalizedA = a2D.div(normA);

//   // Normalize 'b' and ensure it remains 2D
//   const normB = tf.norm(b, 'euclidean', 1, true);  // Keepdims to maintain shape compatibility
//   const normalizedB = b.div(normB);

//   // Matrix multiplication between 2D tensors
//   return tf.matMul(normalizedA, normalizedB, false, true);
// };


// // Main function to analyze text
// const analyzeText = async (sentence, largeText) => {
//   const model = await loadModel();
//   const segments = largeText.match(/[\s\S]{1,500}(?:\s|$)/g) || []; // Regex to split text into segments of up to 500 characters

//   // Encode the sentence and all segments
//   const sentenceEmbedding = await encodeText(model, [sentence]);
//   const segmentEmbeddings = await encodeText(model, segments);

//   // Calculate similarities
//   const similarities = cosineSimilarity(sentenceEmbedding.squeeze(), segmentEmbeddings).dataSync();
  
//   // Find the highest similarity and corresponding segment
//   let highestSimilarity = -1;
//   let bestSegment = "";
//   for (let i = 0; i < similarities.length; i++) {
//       if (similarities[i] > highestSimilarity) {
//           highestSimilarity = similarities[i];
//           bestSegment = segments[i];
//       }
//   }

//   return {
//       highestSimilarity: highestSimilarity,
//       bestSegment: bestSegment
//   };
// };

function App() {
  const [year, setYear] = useState(2024);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isAnalyzing, setIsAnalyzing] = useState(false); // State to track loading status
  const [analyzingCompany, setAnalyzingCompany] = useState(''); // State to track loading status

  // useEffect(() => {
  //   loadModel(); // Load the model on component mount
  // }, []);

  const fetchExampleData = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading

    // fetch(`http://127.0.0.1:5000/example`)
    fetch(`http://127.0.0.1:5000/example`)
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
  
  const fetchData = async () => {
    setTableData([]);
    if (!headline) {
      setError('Headline is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const delay = ms => new Promise(res => setTimeout(res, ms));


    const ticker = ['XOM', "PXD", "ETR", "ED", "PCG"];
    try {
      for (const tickerSymbol of ticker) {
        setAnalyzingCompany(tickerSymbol);
        setIsAnalyzing(true);

        const response = await fetch(`http://127.0.0.1:5000/analyze-company?ticker=${tickerSymbol}&year=${year}&headline=${headline}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ticker ${tickerSymbol}`);
        }
        const data = await response.json();


        const newEntry = {
          Ticker: data[0]["Ticker"],
          CompanyName: data[0]["Company Name"],
          FillDate: data[0]["Fill Date"],
          Year: data[0]["Year"],
          Headline: headline,
          // "Highest Semantic Similarity Score": result.highestSimilarity,
          // "Risk Section Representative Segment": result.bestSegment,
          "Highest Semantic Similarity Score": data[0]["Highest Similarity Score"],
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
      setIsLoading(false);
    }
  };

  
  return (
    <div className="App">
      <div className="navbar bg-slate-200 p-3 mb-2">
            <div className="navbar-start">
            </div>
            <div className="navbar-center">
                <a href="" className="btn btn-ghost normal-case font-extrabold text-3xl">Financial Event Risk Analysis Tool</a>
            </div>
            <div className="navbar-end">
            </div>
        </div>
      <header className="App-header"></header>
      <div className="container text-center mx-auto">
        <h1 className="text-xl font-semibold p-4 mb-2">Event Semantic Similarity Analysis With Company SEC 10-K Risk Factors</h1>
        <p className='mb-6'>
          Enter a news headline or label, representing an <b>event</b>. <br></br>
          This toolkit will analyze if a company has listed concerns related to the event in the risk section of their SEC 10-K.
        </p>
        {/* Form for ticker and year input */}
        <form className="mb-4">
          <input 
            type="text" 
            placeholder="Enter Headline Here" 
            className="input input-bordered w-full max-w-xs mr-2"
            value={headline}
            onChange={(e) => setHeadline(e.target.value.toUpperCase())} // Convert ticker to uppercase
          />
          <input 
            type="number" 
            placeholder="Enter Year Here" 
            className="input input-bordered w-24 max-w-xs mr-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={fetchData}>Analyze Headline</button>
        </form>
        <form onSubmit={fetchExampleData} className="mb-4">
          <button type="submit" className="btn btn-secondary">Show Example Headline</button>
        </form>

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
          {isAnalyzing && <p>Analyzing: {analyzingCompany}...</p>}
        </div>
        )}

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      

        <div>
      </div>
      </div>
    </div>
  );
}

export default App;
