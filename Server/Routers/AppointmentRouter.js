const express = require('express');
const Router = express.Router();

const {
    createAppointment,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
} = require('../Controllers/AppointmentController');
const { verifyToken, checkRole } = require('../middleware/Auth');
const { createAppointmentRules, appointmentIdParamRules, updateStatusRules } = require('../Validators/AppointmentValidators');
const validate = require('../middleware/Validate');

Router.post('/', verifyToken, createAppointmentRules, validate, createAppointment);
Router.get('/me', verifyToken, getMyAppointments);
Router.get('/:id', verifyToken, appointmentIdParamRules, validate, getAppointmentById);
Router.patch('/:id/cancel', verifyToken, appointmentIdParamRules, validate, cancelAppointment);

// admin only
Router.get('/', verifyToken, checkRole('admin'), getAllAppointments);
Router.patch('/:id/status', verifyToken, checkRole('admin'), updateStatusRules, validate, updateAppointmentStatus);

module.exports = Router;
