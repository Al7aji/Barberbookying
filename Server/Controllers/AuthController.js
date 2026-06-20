const User = require('../Models/Users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register controller
const register = async (req,res)=>{
  try{
      const {first_name,Last_name,email,password} = req.body;

      if(!first_name || !Last_name || !email || !password) {
        return res.status(400).json({message: 'All fields are required'})
      }

  // Check if user already exists
    const foundUser = await User.findOne({email});
    if(foundUser) {
      return res.status(401).json({message: 'Email already exists'})
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.refreshToken_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure:true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    });

    res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        user: {
            id: newUser._id,
            first_name: newUser.first_name,
            Last_name: newUser.Last_name,
            email: newUser.email,
            role: newUser.role
     }});
    
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'Server error'})

  }
};



const login = async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email || !password) {
      return res.status(400).json({message: 'All fields are required'})
    }

    const foundUser = await User.findOne({email});
    if(!foundUser) {
      return res.status(401).json({message: 'Invalid email or password'})
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if(!isMatch) {
      return res.status(401).json({message: 'Invalid email or password'})
    }

    const accessToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email, role: foundUser.role },
      process.env.refreshToken_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure:true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    });
    res.status(201).json({
        message: 'User logged in successfully',
        accessToken,
        user: {
            id: foundUser._id,
            first_name: foundUser.first_name,
            Last_name: foundUser.Last_name,
            email: foundUser.email,
            role: foundUser.role
     }});

  }catch(error){
    console.error(error);
    res.status(500).json({message: 'Server error'})
  }
};




module.exports = {
    register,
    login
}