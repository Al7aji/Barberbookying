const Appointment = require('../Models/Appointment');
const Barber = require('../Models/Barber');

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

const createAppointment = async (req, res) => {
    try {
        const { barber, service, date, time, notes } = req.body;

        if (!barber || !service || !date || !time) {
            return res.status(400).json({ message: 'barber, service, date and time are required' });
        }

        const foundBarber = await Barber.findById(barber);
        if (!foundBarber) {
            return res.status(404).json({ message: 'Barber not found' });
        }

        const selectedService = foundBarber.services.find(s => s.name === service);
        if (!selectedService) {
            return res.status(400).json({ message: 'Service not offered by this barber' });
        }

        const requestedStart = toMinutes(time);
        const requestedEnd = requestedStart + selectedService.duration;

        const sameDayAppointments = await Appointment.find({
            barber,
            date,
            status: { $in: ['pending', 'confirmed'] }
        }).lean();

        const hasOverlap = sameDayAppointments.some(a => {
            const existingStart = toMinutes(a.time);
            const existingEnd = existingStart + a.service.duration;
            return requestedStart < existingEnd && requestedEnd > existingStart;
        });
        if (hasOverlap) {
            return res.status(409).json({ message: 'This time slot overlaps with an existing appointment' });
        }

        const appointment = await Appointment.create({
            customer: req.user.id,
            barber,
            service: selectedService,
            date,
            time,
            notes
        });

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('customer', 'first_name Last_name email')
            .populate('barber', 'name specialty')
            .lean();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ customer: req.user.id })
            .populate('barber', 'name specialty')
            .lean();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id)
            .populate('customer', 'first_name Last_name email')
            .populate('barber', 'name specialty')
            .lean();

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const isOwner = appointment.customer?._id?.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json({ appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment status updated', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const isOwner = appointment.customer.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
};
