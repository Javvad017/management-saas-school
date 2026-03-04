import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import studentAPI from '../services/studentAPI';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const resultsData = await studentAPI.getMyResults();
      setResults(resultsData);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.response?.data?.error || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (grade) => {
    const badges = {
      'A+': 'badge-success',
      'A': 'badge-success',
      'B+': 'badge-success',
      'B': 'badge-warning',
      'C': 'badge-warning',
      'D': 'badge-warning',
      'F': 'badge-danger'
    };
    return badges[grade] || 'badge-warning';
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>My Exam Results</h2>
        
        <div className="card">
          {loading ? (
            <p>Loading results...</p>
          ) : error ? (
            <div style={{ 
              padding: '15px', 
              background: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px' 
            }}>
              <p>{error}</p>
              <button onClick={fetchResults} className="btn btn-primary" style={{ marginTop: '10px' }}>
                Retry
              </button>
            </div>
          ) : results.length === 0 ? (
            <p>No exam results found.</p>
          ) : (
            <div>
              {results.map((result) => (
                <div key={result._id} className="card" style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{ marginBottom: '5px' }}>{result.examId.examName}</h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {new Date(result.examId.examDate).toLocaleDateString()} • Class {result.examId.class}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${getGradeBadge(result.grade)}`} style={{ 
                        fontSize: '24px', 
                        padding: '10px 20px' 
                      }}>
                        {result.grade}
                      </span>
                      <p style={{ marginTop: '5px', fontSize: '14px' }}>
                        {result.percentage}%
                      </p>
                    </div>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks Obtained</th>
                        <th>Total Marks</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.marks.map((mark, index) => (
                        <tr key={index}>
                          <td>{mark.subject}</td>
                          <td>{mark.marksObtained}</td>
                          <td>{mark.totalMarks}</td>
                          <td>{((mark.marksObtained / mark.totalMarks) * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
                        <td>Total</td>
                        <td>{result.totalMarksObtained}</td>
                        <td>{result.totalMarks}</td>
                        <td>{result.percentage}%</td>
                      </tr>
                    </tbody>
                  </table>

                  {result.remarks && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '10px', 
                      background: '#f8f9fa', 
                      borderRadius: '4px' 
                    }}>
                      <strong>Remarks:</strong> {result.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <button onClick={fetchResults} className="btn btn-primary">
            Refresh Results
          </button>
        </div>
      </div>
    </>
  );
};

export default Results;
