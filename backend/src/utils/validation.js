const VALID_MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const VALID_TASKS = ["Sales", "Support", "Content", "Paper-work"];

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

function isValidObjectId(id) {
  return OBJECTID_REGEX.test(id);
}

function isValidMonth(month) {
  return typeof month === "string" && VALID_MONTHS.includes(month.toLowerCase());
}

function isPositiveInt(value) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
}

function isValidYear(year) {
  const num = Number(year);
  return Number.isInteger(num) && num >= 1900 && num <= 2100;
}

function isPositiveNumber(value, max = 10000000) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 && num <= max;
}

function isValidDate(dateStr) {
  const d = new Date(dateStr);
  return d instanceof Date && !Number.isNaN(d.getTime());
}

module.exports = {
  VALID_MONTHS,
  VALID_TASKS,
  VALID_EMAIL,
  isValidObjectId,
  isValidMonth,
  isPositiveInt,
  isValidYear,
  isPositiveNumber,
  isValidDate,
};
