// Maps Firebase Auth error codes to messages a user can act on.
const MESSAGES = {
  'auth/invalid-credential': 'Wrong email or password',
  'auth/invalid-email': 'Enter a valid email',
  'auth/email-already-in-use': 'This email is already registered',
  'auth/too-many-requests': 'Too many attempts, try again later',
  'auth/network-request-failed': 'No internet connection',
};

export function getAuthErrorMessage(error) {
  return MESSAGES[error?.code] ?? 'Something went wrong. Please try again.';
}
