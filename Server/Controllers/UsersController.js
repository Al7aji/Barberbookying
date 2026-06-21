const User = require('../Models/Users')

const GetAllUsers =  async (req, res) => {
    try {

    const users = await User.find().select('-password').lean();

    if(!users.length){
        return res.status(404).json({message: 'No users found'});
    }
    res.status(200).json({users});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const GetUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password').lean();

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({user});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


module.exports = {
    GetAllUsers,
    GetUserById
}