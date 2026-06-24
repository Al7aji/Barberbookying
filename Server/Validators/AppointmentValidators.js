const { body, param } = require('express-validator');

const createAppointmentRules = [
    body('barber').notEmpty().withMessage('barber is required')
        .isMongoId().withMessage('barber must be a valid id'),
    body('service').trim().notEmpty().withMessage('service is required'),
    body('date').notEmpty().withMessage('date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('date must be in YYYY-MM-DD format'),
    body('time').notEmpty().withMessage('time is required')
        .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('time must be in HH:mm format'),
    body('notes').optional().trim().isLength({ max: 300 }).withMessage('notes must be under 300 characters')
];

const appointmentIdParamRules = [
    param('id').isMongoId().withMessage('Invalid appointment id')
];

const updateStatusRules = [
    param('id').isMongoId().withMessage('Invalid appointment id'),
    body('status').notEmpty().withMessage('status is required')
        .isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')
];

module.exports = { createAppointmentRules, appointmentIdParamRules, updateStatusRules };
