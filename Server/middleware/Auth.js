const User = require('../Models/Users')

const jwt = require('jsonwebtoken');



const vrifyToken = async (req, res, next) => {
         const authheader = req.headers.authorization ||req.headers.Authorization;

         if(!authheader || !authheader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const token = authheader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();

        }catch(error){
            res.status(403).json({message: 'Forbidden', error: error.message});
        }
        
}



module.exports = {
    vrifyToken
}