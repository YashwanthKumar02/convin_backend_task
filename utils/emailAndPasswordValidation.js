const validateEmailAndPassword = (email, password) => {
    // Custom regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !password) {
      return 'Email and password are required';
    }
  
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
  
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
  
    return null;
  };
  
  module.exports = validateEmailAndPassword;
  