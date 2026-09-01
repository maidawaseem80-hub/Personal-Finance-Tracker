const currencyConfig = {
  PKR: {
    symbol: "Rs.",
    locale: "en-PK",
  },

  USD: {
    symbol: "$",
    locale: "en-US",
  },

  EUR: {
    symbol: "€",
    locale: "de-DE",
  },

  GBP: {
    symbol: "£",
    locale: "en-GB",
  },
};

const formatCurrency = (amount, currency = "PKR") => {
  const config =
    currencyConfig[currency] ||
    currencyConfig.PKR;

  const numericAmount = Number(amount || 0);

  return `${config.symbol} ${numericAmount.toLocaleString(
    config.locale
  )}`;
};

export default formatCurrency;