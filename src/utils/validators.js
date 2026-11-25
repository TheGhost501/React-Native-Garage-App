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
