const express = require('express');
const Router = express.Router();
const {GetAllUsers, GetUserById, UpdateUser} = require('../Controllers/UsersController');
const {vrifyToken} = require('../middleware/Auth');


//accrssible by admin only
Router.get('/',vrifyToken, GetAllUsers);

//accessible by admin and user himself
Router.get('/:id', vrifyToken, GetUserById);




module.exports = Router;