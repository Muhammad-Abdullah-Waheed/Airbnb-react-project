const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  usernumber: { type: String },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user',
  },
});

// Hash the password before saving. The `return next()` is important — without
// it, the function would fall through and re-hash an already-hashed password
// on every subsequent save.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
