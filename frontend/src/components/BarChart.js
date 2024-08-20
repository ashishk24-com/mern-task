import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart, BarElement, BarController, LinearScale } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css'; 

Chart.register(CategoryScale, BarElement, BarController, LinearScale);

function BarChart({ month }) {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get(`http://localhost:5000/api/transactions/barchart?month=${month}`);
      setBarChartData(response.data);
    };
    fetchBarChartData();
  }, [month]);

  const data = {
    labels: barChartData.map(data => data.range),
    datasets: [{
      label: 'Number of Transactions',
      data: barChartData.map(data => data.count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <h4>Bar Chart</h4>
        </div>
        <div className="card-body">
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
}

export default BarChart;
