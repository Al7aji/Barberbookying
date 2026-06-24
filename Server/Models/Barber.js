const mongoose = require('mongoose');

const barberSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true
  },
  specialty: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true } // minutes
  }],
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Barber', barberSchema);
