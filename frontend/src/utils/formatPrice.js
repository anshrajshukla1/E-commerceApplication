export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatPriceCalculation = (quantity, price) => {
  if (price === undefined) {
    return Number(quantity || 0).toFixed(2);
  }

  return (Number(quantity) * Number(price)).toFixed(2);
};

export const formatRevenue = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value;
};
