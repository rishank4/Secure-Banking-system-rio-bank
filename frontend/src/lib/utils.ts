/**
 * Indian Rupee (₹) and Date Formatting Helpers
 */

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10000000) { // 1 Crore = 10,000,000
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) { // 1 Lakh = 100,000
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function getInitials(name: string): string {
  if (!name) return 'RB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

