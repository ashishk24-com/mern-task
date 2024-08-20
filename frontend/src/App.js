import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  const monthMap = {
    January: '2022-01',
    February: '2022-02',
    March: '2022-03',
    April: '2022-04',
    May: '2022-05',
    June: '2022-06',
    July: '2022-07',
    August: '2022-08',
    September: '2022-09',
    October: '2022-10',
    November: '2022-11',
    December: '2022-12',
  };

  const [month, setMonth] = useState(monthMap.March); // YYYY-MM format
  const [search, setSearch] = useState('');

  const handleMonthChange = (e) => {
    const monthName = e.target.value;
    setMonth(monthMap[monthName]);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">MERN Stack Coding Challenge</h1>
      <div className="row mb-3  justify-content-center align-items-center d-flex">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="monthSelect">Select Month</label>
            <select
              id="monthSelect"
              className="form-control"
              value={Object.keys(monthMap).find(key => monthMap[key] === month)}
              onChange={handleMonthChange}
            >
              {Object.keys(monthMap).map(monthName => (
                <option key={monthName} value={monthName}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-8 justify-content-center align-items-center d-flex">
          <div className="input-group mb-3 ">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">Search</button>
            </div>
          </div>
        </div>
      </div>
      <TransactionTable month={month} search={search} />
      <Statistics month={month} search={search} />
      <BarChart month={month} search={search} />
      <PieChart month={month} search={search} />
    </div>
  );
}

export default App;
