import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

const Charts = () => {
  const { categorySummary, balanceHistory, currency } = useFinance();
  
  // Format currency
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };
  
  // Function to format date from ISO string to month/day
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Prepare data for pie chart
  const pieData = categorySummary.map(item => ({
    id: item.id,
    value: item.amount,
    label: item.name,
    color: item.color,
  }));
  
  // Prepare data for line chart
  const lineData = {
    dates: balanceHistory.map(item => formatDate(item.date)),
    balances: balanceHistory.map(item => item.balance),
  };
  
  // Check if there's data to display
  const hasCategories = categorySummary && categorySummary.length > 0;
  const hasBalanceHistory = balanceHistory && balanceHistory.length > 0;
  
  return (
    <div className="space-y-8">
      {/* Category Expenses Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h2>
        {!hasCategories ? (
          <div className="text-center py-10 text-gray-500">
            No expense data for the current month. Start tracking your expenses to see a breakdown here.
          </div>
        ) : (
          <div className="h-80">
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 60,
                  outerRadius: 140,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  startAngle: -90,
                  endAngle: 270,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={500}
              height={300}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  itemMarkWidth: 20,
                  itemMarkHeight: 20,
                  markGap: 10,
                  itemGap: 10,
                },
              }}
              margin={{ top: 0, bottom: 0, left: 0, right: 140 }}
            />
          </div>
        )}
      </div>
      
      {/* Balance History Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Balance History</h2>
        {!hasBalanceHistory ? (
          <div className="text-center py-10 text-gray-500">
            No balance history data available. Add transactions to see your balance trend.
          </div>
        ) : (
          <div className="h-80">
            <LineChart
              xAxis={[{ 
                data: lineData.dates,
                scaleType: 'point',
                label: 'Date',
              }]}
              yAxis={[{ 
                label: 'Balance',
                valueFormatter: (value) => formatCurrency(value),
              }]}
              series={[
                {
                  data: lineData.balances,
                  label: 'Balance',
                  area: true,
                  showMark: false,
                  color: '#4f46e5',
                },
              ]}
              width={800}
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts; 