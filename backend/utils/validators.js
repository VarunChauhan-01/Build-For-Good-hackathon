/**
 * Input Validators
 */

// Email validation
console.log("validators.js loaded");
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Aadhaar validation
function validateAadhaar(aadhaar) {
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
}

// OTP validation
function validateOtp(otp) {
  return /^\d{6}$/.test(otp);
}

// Check required fields
function validateRequired(fields, body) {
  const missing = fields.filter(
    field => !body[field] || String(body[field]).trim() === ""
  );

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  return null;
}

// Register validation
function validateRegister({ name, email, password }) {
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Login validation
function validateLogin({ email, password }) {
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export all validators
module.exports = {
  validateEmail,
  validateAadhaar,
  validateOtp,
  validateRequired,
  validateRegister,
  validateLogin
};
