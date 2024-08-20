import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Chart, PieController, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(ArcElement, PieController, Tooltip, Legend);

function PieChart({ month }) {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      const response = await axios.get(`http://localhost:5000/api/transactions/piechart?month=${month}`);
      setPieChartData(response.data);
    };
    fetchPieChartData();
  }, [month]);

  const data = {
    labels: pieChartData.map(data => data.category),
    datasets: [{
      label: 'Number of Transactions',
      data: pieChartData.map(data => data.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }],
  };

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <h4>Pie Chart</h4>
        </div>
        <div className="card-body ">
          <Pie data={data}  />
        </div>
      </div>
    </div>
  );
}

export default PieChart;
