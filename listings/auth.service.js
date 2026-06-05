const bcrypt = require('bcryptjs');
const db = require('../../models');

const registerUser = async ({ email, password, fullName, role } = {}) => {
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedFullName = typeof fullName === 'string' ? fullName.trim() : '';
    const normalizedRole = typeof role === 'string' ? role.trim() : '';

    const isPasswordInvalid = typeof password !== 'string' || password.length === 0;

    if (!normalizedEmail || isPasswordInvalid || !normalizedFullName || !normalizedRole) {
        const error = new Error('Заполните все поля');
        error.status = 400;
        throw error;
    }

    if (!['candidate', 'employer'].includes(normalizedRole)) {
        const error = new Error('Недопустимая роль пользователя');
        error.status = 400;
        throw error;
    }

    const existingUser = await db.User.findOne({
        where: { email: normalizedEmail }
    });

    if (existingUser) {
        const error = new Error('Пользователь с такой почтой уже существует');
        error.status = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.User.create({
        email: normalizedEmail,
        passwordHash,
        fullName: normalizedFullName,
        role: normalizedRole,
        isBlocked: false
    });

    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isBlocked: user.isBlocked
    };
};

const loginUser = async ({ email, password } = {}) => {
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';

    if (!normalizedEmail || typeof password !== 'string' || password.length === 0) {
        const error = new Error('Укажите email и пароль');
        error.status = 400;
        throw error;
    }

    const user = await db.User.findOne({
        where: { email: normalizedEmail }
    });

    if (!user) {
        const error = new Error('Неверный email или пароль');
        error.status = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
        const error = new Error('Неверный email или пароль');
        error.status = 401;
        throw error;
    }

    if (user.isBlocked) {
        const error = new Error('Пользователь заблокирован');
        error.status = 403;
        throw error;
    }

    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isBlocked: user.isBlocked
    };
};

module.exports = {
    registerUser,
    loginUser
};
