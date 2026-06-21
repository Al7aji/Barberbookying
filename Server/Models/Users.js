const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
 first_name: {
    type: String,
    required: [true, 'firstName required'],
    trim: true
  },
  Last_name: {
    type: String,
    required: [true, 'LastName required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 6,

  },
  role: {
    type: String,
    enum: ['customer','admin'],
    default: 'customer'
  },
  refreshToken: {
    type: String,
    
  }

}, { timestamps: true })

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model('User', userSchema)


