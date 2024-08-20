const axios = require('axios');
const Transaction = require('../models/Transaction');

// Fetch and initialize data from third-party API
const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.status(200).json({ message: 'Database initialized' });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
};

const getMonthRange = (month) => {
  const [year, monthIndex] = month.split('-').map(Number);
  const startDate = new Date(year, monthIndex - 1, 1);
  const endDate = new Date(year, monthIndex, 0, 23, 59, 59, 999); 
  return { startDate, endDate };
};


const getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  let query = {};

  if (month) {
    const { startDate, endDate } = getMonthRange(month);
    query.dateOfSale = { $gte: startDate, $lte: endDate };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      // Assuming price is a number, remove the regex query
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};


const getStatistics = async (req, res) => {
  const { month } = req.query;
  try {
    const { startDate, endDate } = getMonthRange(month);
    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

    const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;

    res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

const getBarChartData = async (req, res) => {
  const { month } = req.query;
  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  try {
    const { startDate, endDate } = getMonthRange(month);
    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
    const barChartData = priceRanges.map(range => ({
      range: range.range,
      count: transactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length,
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Failed to fetch bar chart data:', error);
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
};


const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const { startDate, endDate } = getMonthRange(month);
    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

    const categoryCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Failed to fetch pie chart data:', error);
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
};

const getCombinedData = async (req, res) => {
  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      getStatisticsData(req),
      getBarChartDataData(req),
      getPieChartDataData(req),
    ]);

    res.status(200).json({ statistics, barChartData, pieChartData });
  } catch (error) {
    console.error('Failed to fetch combined data:', error);
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
};


const getStatisticsData = async (req) => {
  const { month } = req.query;
  const { startDate, endDate } = getMonthRange(month);
  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
  const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
  const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
  const totalNotSoldItems = transactions.length - totalSoldItems;

  return { totalSaleAmount, totalSoldItems, totalNotSoldItems };
};

const getBarChartDataData = async (req) => {
  const { month } = req.query;
  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  const { startDate, endDate } = getMonthRange(month);
  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
  return priceRanges.map(range => ({
    range: range.range,
    count: transactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length,
  }));
};

const getPieChartDataData = async (req) => {
  const { month } = req.query;
  const { startDate, endDate } = getMonthRange(month);
  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

  const categoryCounts = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};
