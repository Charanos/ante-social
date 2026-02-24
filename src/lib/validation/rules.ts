export const validationRules = {
  stake: {
    min: 10,
    max: (userLimit: number) => userLimit,
    validate: (value: number, balance: number) => {
      if (Number.isNaN(value) || value <= 0) return "Enter a valid amount";
      if (value < 10) return "Minimum stake is $10";
      if (value > balance) return "Insufficient balance";
      return null;
    },
  },

  withdrawAmount: {
    min: 50,
    validate: (value: number, balance: number, dailyLimit: number) => {
      if (Number.isNaN(value) || value <= 0) return "Enter a valid amount";
      if (value < 50) return "Minimum withdrawal is $50";
      if (value > balance) return "Insufficient balance";
      if (value > dailyLimit) return `Daily limit: $${dailyLimit}`;
      return null;
    },
  },

  phoneNumber: {
    pattern: /^254[17]\d{8}$/,
    validate: (value: string) => {
      const normalized = normalizeMpesaPhone(value);
      if (!normalized || !normalized.match(/^254[17]\d{8}$/)) {
        return "Invalid phone number. Use format: 254XXXXXXXXX";
      }
      return null;
    },
  },

  market: {
    title: { minLength: 10, maxLength: 200 },
    options: { min: 2, max: 10 },
    closesAt: {
      validate: (date: Date) => {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
          return "Invalid close date";
        }
        if (date <= new Date()) return "Must be in the future";
        return null;
      },
    },
  },
};

export function normalizeMpesaPhone(value: string) {
  const stripped = value.replace(/\s+/g, "").replace(/[()-]/g, "");
  if (!stripped) return "";
  if (stripped.startsWith("+254")) return stripped.slice(1);
  if (stripped.startsWith("254")) return stripped;
  if (stripped.startsWith("0") && stripped.length === 10) {
    return `254${stripped.slice(1)}`;
  }
  return stripped;
}

export function isTrc20Address(address: string) {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim());
}
