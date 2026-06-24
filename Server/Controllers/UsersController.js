const User = require('../Models/Users')

const GetAllUsers =  async (req, res) => {
    try {

    const users = await User.find().select('-password -refreshToken').lean();
      
     if(!users || users.length === 0){ 
        res.status(404).json({message: 'No users found'});
     }


    res.status(200).json({users});
    
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const GetUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password -refreshToken').lean();

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({user});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const UpdateUser = async (req, res) => {
    try {
        const {id} = req.params;

        const isOwner = req.user.id === id;
        if(!isOwner && req.user.role !== 'admin'){
            return res.status(403).json({message: 'Forbidden'});
        }

        const {first_name, Last_name, email} = req.body;
        const updates = {};
        if(first_name) updates.first_name = first_name;
        if(Last_name) updates.Last_name = Last_name;
        if(email) updates.email = email;

        // only an admin may change roles
        if(req.body.role && req.user.role === 'admin'){
            updates.role = req.body.role;
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
            .select('-password -refreshToken');

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User updated successfully', user});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const DeleteUser = async (req, res) => {
    try {
        const {id} = req.params;

        const isOwner = req.user.id === id;
        if(!isOwner && req.user.role !== 'admin'){
            return res.status(403).json({message: 'Forbidden'});
        }

        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


module.exports = {
    GetAllUsers,
    GetUserById,
    UpdateUser,
    DeleteUser
}