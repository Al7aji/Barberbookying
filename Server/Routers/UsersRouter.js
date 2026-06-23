const express = require('express');
const Router = express.Router();
const {GetAllUsers, GetUserById, UpdateUser} = require('../Controllers/UsersController');
const {verifyToken , checkRole} = require('../middleware/Auth');
//accrssible by admin only

Router.get('/',verifyToken,checkRole('admin') ,GetAllUsers);

//accessible by admin and user himself
Router.get('/:id',verifyToken, GetUserById);




module.exports = Router;