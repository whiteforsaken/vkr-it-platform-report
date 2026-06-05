const jwt = require('jsonwebtoken');
const env = require('../config/env');
const db = require('../../models');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        const error = new Error('Требуется вход в систему');
        error.status = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        const user = await db.User.findByPk(decoded.id, {
            attributes: ['id', 'email', 'fullName', 'role', 'isBlocked']
        });

        if (!user) {
            const error = new Error('Пользователь не найден');
            error.status = 401;
            return next(error);
        }

        if (user.isBlocked) {
            const error = new Error('Пользователь заблокирован');
            error.status = 403;
            return next(error);
        }

        req.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isBlocked: user.isBlocked
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            const authError = new Error('Сессия истекла или недействительна');
            authError.status = 401;
            return next(authError);
        }

        return next(error);
    }
};

module.exports = authMiddleware;
