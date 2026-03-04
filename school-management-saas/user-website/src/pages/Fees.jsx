import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import studentAPI from '../services/studentAPI';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);

      const [feesData, summaryData] = await Promise.all([
        studentAPI.getMyFees(),
        studentAPI.getFeeSummary()
      ]);

      setFees(feesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching fees:', err);
      setError(err.response?.data?.error || 'Failed to load fee data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Paid: 'badge-success',
      Pending: 'badge-warning',
      Overdue: 'badge-danger'
    };
    return badges[status] || '';
  };

  const calculateDueAmount = (fee) => {
    return fee.amount - fee.paidAmount;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>My Fees</h2>

        {/* Fee Summary */}
        {summary && (
          <div className="stats-grid" style={{ marginBottom: '20px' }}>
            <div className="stat-card">
              <h3>Total Amount</h3>
              <div className="value">₹{summary.totalAmount}</div>
            </div>
            <div className="stat-card">
              <h3>Total Paid</h3>
              <div className="value" style={{ color: '#28a745' }}>₹{summary.totalPaid}</div>
            </div>
            <div className="stat-card">
              <h3>Total Due</h3>
              <div className="value" style={{ color: '#dc3545' }}>₹{summary.totalDue}</div>
            </div>
            <div className="stat-card">
              <h3>Pending Fees</h3>
              <div className="value">{summary.pendingCount}</div>
            </div>
          </div>
        )}
        
        {/* Fee Records */}
        <div className="card">
          {loading ? (
            <p>Loading fee records...</p>
          ) : error ? (
            <div style={{ 
              padding: '15px', 
              background: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px' 
            }}>
              <p>{error}</p>
              <button onClick={fetchFees} className="btn btn-primary" style={{ marginTop: '10px' }}>
                Retry
              </button>
            </div>
          ) : fees.length === 0 ? (
            <p>No fee records found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id}>
                    <td>{fee.feeType}</td>
                    <td>{fee.month} {fee.year}</td>
                    <td>₹{fee.amount}</td>
                    <td>₹{fee.paidAmount}</td>
                    <td style={{ color: calculateDueAmount(fee) > 0 ? '#dc3545' : '#28a745' }}>
                      ₹{calculateDueAmount(fee)}
                    </td>
                    <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <button onClick={fetchFees} className="btn btn-primary">
            Refresh Fee Data
          </button>
        </div>
      </div>
    </>
  );
};

export default Fees;
