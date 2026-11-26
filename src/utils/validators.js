// React Hook Form `rules` objects, shared by every form so messages stay consistent.

export const emailRules = {
  required: 'Email is required',
  minLength: { value: 6, message: 'Email must be at least 6 characters long' },
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
};

// Register: the "multiple rules" field for the rubric.
export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 6, message: 'At least 6 characters' },
  pattern: { value: /\d/, message: 'Must contain at least one digit' },
};

// Login only checks that the field is filled in; Firebase decides if it's correct.
export const loginPasswordRules = { required: passwordRules.required };

// Vehicle form
export const makeRules = {
  required: 'Vehicle make is required',
  minLength: { value: 2, message: 'At least 2 characters' },
  maxLength: { value: 30, message: 'At most 30 characters' },
};

export const modelRules = {
  required: 'Vehicle model is required',
  minLength: { value: 2, message: 'At least 2 characters' },
  maxLength: { value: 30, message: 'At most 30 characters' },
};

// TextInput always gives a string. Test the raw text first: /^\d+$/ rejects
// "-5", "12.5", " 12" and "1e3", which Number() alone would accept.
// Returns true, or the message to show (that's what React Hook Form's `validate` expects).
const checkWholeNumber = (value, min, max, rangeMessage) => {
  if (!/^\d+$/.test(value)) return 'Whole numbers only';
  const n = Number(value);
  if (n < min || n > max) return rangeMessage;
  return true;
};

export const yearRules = {
  required: 'Vehicle year is required',
  validate: (v) => {
    const maxYear = new Date().getFullYear() + 1; // next year's models are already on sale
    return checkWholeNumber(v, 1950, maxYear, `Year must be between 1950 and ${maxYear}`);
  },
};

export const plateRules = {
  required: 'Licence plate is required',
  pattern: {
    value: /^[A-Za-z0-9 -]{4,10}$/,
    message: '4–10 characters: letters, digits, spaces or dashes',
  },
};

export const mileageRules = {
  required: 'Mileage is required',
  validate: (v) => checkWholeNumber(v, 0, 2_000_000, 'Mileage must be between 0 and 2,000,000 km'),
};
