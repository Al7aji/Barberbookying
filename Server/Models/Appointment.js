const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  service: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }
  },
  date: {
    type: String, // YYYY-MM-DD
    required: [true, 'Date required']
  },
  time: {
    type: String, // HH:mm
    required: [true, 'Time required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

appointmentSchema.index({ barber: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
