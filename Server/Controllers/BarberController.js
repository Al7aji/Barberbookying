const Barber = require('../Models/Barber');
const Appointment = require('../Models/Appointment');

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

const toHHMM = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0');
    const m = String(minutes % 60).padStart(2, '0');
    return `${h}:${m}`;
};

const getAllBarbers = async (req, res) => {
    try {
        const barbers = await Barber.find().lean();
        res.status(200).json({ barbers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getBarberById = async (req, res) => {
    try {
        const { id } = req.params;
        const barber = await Barber.findById(id).lean();

        if (!barber) {
            return res.status(404).json({ message: 'Barber not found' });
        }
        res.status(200).json({ barber });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createBarber = async (req, res) => {
    try {
        const { name, specialty, phone, bio, services, workingHours } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const barber = await Barber.create({ name, specialty, phone, bio, services, workingHours });
        res.status(201).json({ message: 'Barber created successfully', barber });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateBarber = async (req, res) => {
    try {
        const { id } = req.params;
        const barber = await Barber.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!barber) {
            return res.status(404).json({ message: 'Barber not found' });
        }
        res.status(200).json({ message: 'Barber updated successfully', barber });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteBarber = async (req, res) => {
    try {
        const { id } = req.params;
        const barber = await Barber.findByIdAndDelete(id);

        if (!barber) {
            return res.status(404).json({ message: 'Barber not found' });
        }
        res.status(200).json({ message: 'Barber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, service } = req.query;

        if (!date || !service) {
            return res.status(400).json({ message: 'date and service query params are required' });
        }

        const barber = await Barber.findById(id).lean();
        if (!barber) {
            return res.status(404).json({ message: 'Barber not found' });
        }

        const selectedService = barber.services.find(s => s.name === service);
        if (!selectedService) {
            return res.status(400).json({ message: 'Service not offered by this barber' });
        }
        const duration = selectedService.duration;

        const dayStart = toMinutes(barber.workingHours.start);
        const dayEnd = toMinutes(barber.workingHours.end);

        const bookedAppointments = await Appointment.find({
            barber: id,
            date,
            status: { $in: ['pending', 'confirmed'] }
        }).lean();

        const bookedRanges = bookedAppointments.map(a => {
            const start = toMinutes(a.time);
            return { start, end: start + a.service.duration };
        });

        const slots = [];
        for (let start = dayStart; start + duration <= dayEnd; start += duration) {
            const end = start + duration;
            const overlaps = bookedRanges.some(r => start < r.end && end > r.start);
            if (!overlaps) {
                slots.push(toHHMM(start));
            }
        }

        res.status(200).json({ date, service, duration, slots });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllBarbers,
    getBarberById,
    createBarber,
    updateBarber,
    deleteBarber,
    getAvailableSlots
};
