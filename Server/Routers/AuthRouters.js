const express = require('express');
const Router = express.Router();
const {register , login , refresh, logout} = require('../Controllers/AuthController');
const { registerRules, loginRules } = require('../Validators/AuthValidators');
const validate = require('../middleware/Validate');

Router.post('/register', registerRules, validate, register);
Router.post('/login', loginRules, validate, login);
Router.get('/refresh', refresh);
Router.post('/logout', logout);



module.exports = Router