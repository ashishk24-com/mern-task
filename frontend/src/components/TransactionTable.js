import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionTable({ month, search }) {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {  
          params: { month, search, page: currentPage, perPage: itemsPerPage },
        });
        setTransactions(response.data);
        console.log("Response for the table is "+response.data)
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    if (month) {
      fetchTransactions();
    }
  }, [month, search, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(transactions.total / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-4">
      <h2>Transaction Table</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>₹{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-2">
        <p className="col-4 text-muted">
          Page No: {currentPage} of {Math.ceil(transactions.total / itemsPerPage)}
        </p>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center"> {/* Centered pagination */}
            <li className="page-item">
              <button
                className="page-link"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={handleNextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
        <select
          className="form-select col-4"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(e.target.value)}
        >
          <option value="5">5</option>
          <option value="10">10 (Selected)</option> 
          <option value="25">25</option>
        </select>
        <p className="col-4 text-muted">Per Page: </p>
      </div>
    </div>
  );
}

export default TransactionTable;