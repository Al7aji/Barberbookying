const { body, param } = require('express-validator');

const mongoIdParam = param('id').isMongoId().withMessage('Invalid user id');

const updateUserRules = [
    mongoIdParam,
    body('first_name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('first_name must be between 2 and 50 characters'),
    body('Last_name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last_name must be between 2 and 50 characters'),
    body('email').optional().trim().isEmail().withMessage('email must be a valid email address').normalizeEmail(),
    body('role').optional().isIn(['customer', 'admin']).withMessage('role must be customer or admin')
];

const userIdParamRules = [mongoIdParam];

module.exports = { updateUserRules, userIdParamRules };
