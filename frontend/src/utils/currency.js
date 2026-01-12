export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '') {
    return '₹0';
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, 
  }).format(numericAmount);
};


export const formatForInput = (amount) => {
  if (!amount && amount !== 0) return '';
  return amount.toString();
};