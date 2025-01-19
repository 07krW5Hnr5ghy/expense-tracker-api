const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const CustomError = require('../utils/customError');

const protect = async (req, res, next) => {
    let token;
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            next(new CustomError("Invalid authentication token.",401));
        }
    }
};

module.exports = { protect };
