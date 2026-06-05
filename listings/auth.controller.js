const { registerUser, loginUser } = require('../services/auth.service');
const generateToken = require('../utils/generate-token');
const env = require('../config/env');

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: env.COOKIE_MAX_AGE_MS
};

const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body);

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'Login successful',
            user
        });
    } catch (error) {
        next(error);
    }
};

const getMe = (req, res) => {
    res.status(200).json({
        message: 'Current user',
        user: req.user
    });
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: cookieOptions.httpOnly,
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure,
        path: cookieOptions.path
    });

    res.status(200).json({
        message: 'Logout successful'
    });
};

module.exports = {
    register,
    login,
    getMe,
    logout
};