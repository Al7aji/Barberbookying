const { body } = require('express-validator');

const registerRules = [
    body('first_name').trim().notEmpty().withMessage('first_name is required')
        .isLength({ min: 2, max: 50 }).withMessage('first_name must be between 2 and 50 characters'),
    body('Last_name').trim().notEmpty().withMessage('Last_name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last_name must be between 2 and 50 characters'),
    body('email').trim().notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('password is required')
        .isLength({ min: 6 }).withMessage('password must be at least 6 characters')
];

const loginRules = [
    body('email').trim().notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('password is required')
];

module.exports = { registerRules, loginRules };
