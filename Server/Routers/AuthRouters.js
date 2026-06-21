const express = require('express');
const Router = express.Router();
const {register , login , refresh, logout} = require('../Controllers/AuthController');

Router.post('/register',register);
Router.post('/login',login);
Router.get('/refresh', refresh);
Router.post('/logout', logout);



module.exports = Router