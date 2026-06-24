const User = require('../Models/Users');
const {sigtoken, sigrefreshToken} = require('../Utils/Tokens');
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
      return res.status(409).json({message: 'Email already exists'})
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await User.create({
          first_name,
          Last_name,
          email,
          password: hashedPassword,
      });


    // Generate access and refresh tokens
    const accessToken = sigtoken({
      id: newUser._id,
      role: newUser.role
    });
    const refreshToken = sigrefreshToken({
      id: newUser._id,
      role: newUser.role
    });

    // Hash the refresh token
    newUser.refreshToken = await bcrypt.hash(refreshToken, 10);
    // Save the hashed refresh token to the database
    await newUser.save();
    // Set the refresh token as an HTTP-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
        message: 'User registered successfully',
        accessToken: accessToken,
        user: {
            id: newUser._id,
            first_name: newUser.first_name,
            Last_name: newUser.Last_name,
            email: newUser.email,
            role: newUser.role
     }});
    
  }catch(error){
    console.error(error);
    res.status(500).json({message: `Server error ${error.message}`})

  }
};


// Login controller
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
    const isMatchPassword = await bcrypt.compare(password, foundUser.password);

   // Check if the password is correct
    if(!isMatchPassword) {
      return res.status(401).json({message: 'Invalid email or password'})
    }
    // Generate access and refresh tokens
    const accessToken = sigtoken({
      id: foundUser._id,
      role: foundUser.role
    });
    const refreshToken = sigrefreshToken({
      id: foundUser._id,
      role: foundUser.role
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });


    res.status(200).json({
        message: 'User logged in successfully',
        accessToken: accessToken,
        user: {
            id: foundUser._id,
            first_name: foundUser.first_name,
            Last_name: foundUser.Last_name,
            email: foundUser.email,
            role: foundUser.role
     }});

  }catch(error){
    console.error(error);
    res.status(500).json({message: `Server error ${error.message}`})
  }
};


 // Refresh token controller
const refresh = async (req, res) => {
   try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: 'no token found' });
        } 
       const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      // Find the user by ID from the decoded token
       const user = await User.findById(decoded.id);

      // Check if user exists and has a refresh token
        if (!user || !user.refreshToken) {
            return res.status(403).json({ message: 'Forbidden' });
        }
      // Verify the refresh token
        const isValid = await bcrypt.compare(token, user.refreshToken);
        if (!isValid) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
      
        // Generate a new access token
        const accessToken = sigtoken(user);
        const refreshToken = sigrefreshToken(user);

        // Hash the new refresh token and save it to the database
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save();
       
        // Set the new refresh token as an HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: accessToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error ${error.message}` });
    }
}


const logout = async (req, res) => {
  const token = req.cookies?.jwt;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    } catch (error) {
      console.error('logout: failed to clear refreshToken in DB', error);
    }
  }

  res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'Lax' });
  res.status(200).json({ message: 'Logged out successfully' });
};



module.exports = {
    register,
    login,
    refresh,
    logout
}