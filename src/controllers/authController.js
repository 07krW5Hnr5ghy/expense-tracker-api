const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const CustomError = require('../utils/customError');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup
const signup = async (req, res, next) => {
    
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new CustomError("Name, email, and password are required.", 400);
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new CustomError("Email is already in use.", 400);
        }

        // Create new user
        const user = await User.create({ name, email, password });

        // Respond with token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
};

// Login
const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new CustomError("Email and password are required.", 400);
        }
        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Respond with token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            throw new CustomError("Invalid email or password.", 401);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };
