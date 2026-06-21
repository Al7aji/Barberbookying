const express = require('express');
const Router = express.Router();
const {GetAllUsers, GetUserById, UpdateUser} = require('../Controllers/UsersController');


Router.get('/', GetAllUsers);
Router.get('/:id', GetUserById);




module.exports = Router;