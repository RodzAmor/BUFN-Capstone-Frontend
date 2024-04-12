import { useState, useEffect } from 'react';

const tokenizeText = (text) => {
  return text.toLowerCase().match(/\w+/g) || [];
};

// Function to calculate cosine similarity between two texts
const calculateCosineSimilarity = (text1, text2) => {
  const tokens1 = tokenizeText(text1);
  const tokens2 = tokenizeText(text2);

  const setTokens = new Set([...tokens1, ...tokens2]);
  const vec1 = Array.from(setTokens).map(token => tokens1.includes(token) ? 1 : 0);
  const vec2 = Array.from(setTokens).map(token => tokens2.includes(token) ? 1 : 0);

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
};


const CosineSimilarityTable = ({ ticker, year, headline }) => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false); // To control visibility of the table


  const fetchData = () => {
    const tickersArray = Array.isArray(ticker) ? ticker : [ticker];

    setData([]);

    tickersArray.forEach(ticker => {
      // Fetch data for each ticker
      fetch(`http://127.0.0.1:5000/company?ticker=${ticker}&year=${year}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok for ticker ${ticker}`);
          }
          return response.json();
        })
        .then(data => {
          // Assuming the data structure is as described, adjust if necessary
          const newData = data.data ? JSON.parse(data.data) : [];
          setData(currentData => [...currentData, ...newData]);
        })
        .catch(error => console.error("Error fetching data:", error));
    });
  };

  const calculateSimilarityScores = (data) => {
    const scores = [];
    for (let i = 1; i < data.length; i++) {
      const currentText = data[i]['Risk Factors Text'];
      const headlineText = headline;
      scores.push({
        currentText: currentText.substring(0, 50) + '...', // Show first 50 chars
        headlineText: headlineText.substring(0, 50) + '...',
        similarity: calculateCosineSimilarity(currentText, headlineText).toFixed(3)
      });
    }
    return scores;
  };

  const similarityScores = calculateSimilarityScores(data);

  return (
    <div>
      {/* <button onClick={fetchData}>Analyze Tickers</button> */}
      <button type="button" className="btn btn-primary" onClick={fetchData}>Analyze Headline</button>
      <h2>Cosine Similarity Scores</h2>
      {similarityScores.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Headline</th>
              <th>Risk Section</th>
              <th>Similarity Score</th>
            </tr>
          </thead>
          <tbody>
            {similarityScores.map((score, index) => (
              <tr key={index}>
                <td>{score.headlinetext}</td>
                <td>{score.currentText}</td>
                <td>{score.similarity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default CosineSimilarityTable;
