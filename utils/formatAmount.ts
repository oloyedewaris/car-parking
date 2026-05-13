export const formatAmount = (str: string) => {
  if (!str) return "N0.00";

  const num = Number(str.toString().replace(/,/g, "")) / 100;

  return `N${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
