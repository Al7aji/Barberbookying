const express = require('express');
const Router = express.Router();
const {GetAllUsers, GetUserById, UpdateUser, DeleteUser} = require('../Controllers/UsersController');
const {verifyToken , checkRole} = require('../middleware/Auth');
const { updateUserRules, userIdParamRules } = require('../Validators/UserValidators');
const validate = require('../middleware/Validate');
//accrssible by admin only

Router.get('/',verifyToken,checkRole('admin') ,GetAllUsers);

//accessible by admin and user himself
Router.get('/:id',verifyToken, userIdParamRules, validate, GetUserById);
Router.put('/:id',verifyToken, updateUserRules, validate, UpdateUser);
Router.delete('/:id',verifyToken, userIdParamRules, validate, DeleteUser);




module.exports = Router;