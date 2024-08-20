import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Statistics({ month, search }) {
  const [statistics, setStatistics] = useState({ totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions/statistics', {
          params: { month, search }
        });
        setStatistics(response.data);
        console.log("statistics data :"+response.data)
      } catch (error) {
        console.error('Error fetching statistics:', error.message);
      }
    };

    if (month) {
      fetchStatistics();
    }
  }, [month, search]);

  return (
    <div className="mt-4">
      <h2>Statistics</h2>
      <div className="card">
        <div className="card-body">
          <p className="card-text">Total Sale Amount: ₹{statistics.totalSaleAmount.toFixed(2)}</p>
          <p className="card-text">Total Sold Items: {statistics.totalSoldItems}</p>
          <p className="card-text">Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
