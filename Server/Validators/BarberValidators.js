const { body, param, query } = require('express-validator');

const mongoIdParam = param('id').isMongoId().withMessage('Invalid barber id');

const serviceValidator = body('services')
    .optional()
    .isArray().withMessage('services must be an array');

const createBarberRules = [
    body('name').trim().notEmpty().withMessage('name is required')
        .isLength({ min: 2, max: 50 }).withMessage('name must be between 2 and 50 characters'),
    body('phone').optional().trim().isMobilePhone('any').withMessage('phone must be a valid phone number'),
    serviceValidator,
    body('services.*.name').optional().trim().notEmpty().withMessage('service name is required'),
    body('services.*.price').optional().isFloat({ min: 0 }).withMessage('service price must be a positive number'),
    body('services.*.duration').optional().isInt({ min: 5 }).withMessage('service duration must be at least 5 minutes'),
    body('workingHours.start').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('workingHours.start must be in HH:mm format'),
    body('workingHours.end').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('workingHours.end must be in HH:mm format')
];

const updateBarberRules = [
    mongoIdParam,
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('name must be between 2 and 50 characters'),
    body('phone').optional().trim().isMobilePhone('any').withMessage('phone must be a valid phone number'),
    serviceValidator,
    body('services.*.name').optional().trim().notEmpty().withMessage('service name is required'),
    body('services.*.price').optional().isFloat({ min: 0 }).withMessage('service price must be a positive number'),
    body('services.*.duration').optional().isInt({ min: 5 }).withMessage('service duration must be at least 5 minutes'),
    body('workingHours.start').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('workingHours.start must be in HH:mm format'),
    body('workingHours.end').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('workingHours.end must be in HH:mm format')
];

const barberIdParamRules = [mongoIdParam];

const availableSlotsRules = [
    mongoIdParam,
    query('date').notEmpty().withMessage('date query param is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('date must be in YYYY-MM-DD format'),
    query('service').notEmpty().withMessage('service query param is required')
];

module.exports = { createBarberRules, updateBarberRules, barberIdParamRules, availableSlotsRules };
