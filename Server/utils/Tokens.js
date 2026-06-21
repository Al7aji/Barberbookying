const jwt = require('jsonwebtoken');
const sigtoken = (user) => {
    return jwt.sign(
        { id: user._id,  role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
}; 

const sigrefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = { sigtoken, sigrefreshToken };