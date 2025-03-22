import React from 'react';

const BalanceCard = ({ balance, currency }) => {
  // Function to format currency
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  };

  // Determine card color based on balance
  const cardBgColor = balance >= 0 ? 'bg-green-100' : 'bg-red-100';
  const textColor = balance >= 0 ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`rounded-lg shadow-md p-6 ${cardBgColor}`}>
      <h2 className="text-lg font-semibold text-gray-900">Current Balance</h2>
      <p className={`mt-2 text-3xl font-bold ${textColor}`}>
        {formatCurrency(balance)}
      </p>
    </div>
  );
};

export default BalanceCard; 