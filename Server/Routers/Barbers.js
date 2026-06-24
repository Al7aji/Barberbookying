const  express = require('express');
const Router = express.Router();

const {getAllBarbers,getBarberById,createBarber,updateBarber,deleteBarber,getAvailableSlots} = require('../Controllers/BarberController');
const { verifyToken,checkRole} = require('../middleware/Auth');
const { createBarberRules, updateBarberRules, barberIdParamRules, availableSlotsRules } = require('../Validators/BarberValidators');
const validate = require('../middleware/Validate');

Router.get('/', verifyToken, getAllBarbers);
Router.get('/:id', verifyToken, barberIdParamRules, validate, getBarberById);
Router.get('/:id/available-slots', verifyToken, availableSlotsRules, validate, getAvailableSlots);

//access for admin only
Router.post('/', verifyToken, checkRole('admin'), createBarberRules, validate, createBarber);
Router.put('/:id', verifyToken, checkRole('admin'), updateBarberRules, validate, updateBarber);
Router.delete('/:id', verifyToken, checkRole('admin'), barberIdParamRules, validate, deleteBarber);



module.exports = Router;