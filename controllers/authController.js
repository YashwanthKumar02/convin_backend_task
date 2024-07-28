const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateEmailAndPassword = require('../utils/emailAndPasswordValidation');

exports.register = async (req, res) => {
  const { email, password, name, mobileNo } = req.body;
  const validationError = validateEmailAndPassword(email, password);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User with this email already exists' });

    user = new User({ email, password, name, mobile:mobileNo });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const validationError = validateEmailAndPassword(email, password);
  
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
  
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token, message: 'Login successful' });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
