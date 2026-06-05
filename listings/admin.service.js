const { User, Vacancy, Company } = require('../../models');

async function getAllUsers() {
    return User.findAll({
        attributes: ['id', 'email', 'fullName', 'role', 'isBlocked'],
        order: [['id', 'ASC']]
    });
}

async function getAllVacancies() {
    return Vacancy.findAll({
        include: [
            {
                model: Company,
                as: 'company',
                attributes: ['id', 'name', 'website']
            }
        ],
        order: [['id', 'ASC']]
    });
}

async function blockUserById(userId, currentUserId) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'fullName', 'role', 'isBlocked']
    });

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    if (String(user.id) === String(currentUserId)) {
        const error = new Error('Admin cannot block own account');
        error.status = 400;
        throw error;
    }

    user.isBlocked = true;
    await user.save();

    return user;
}

async function unpublishVacancyById(vacancyId) {
    const vacancy = await Vacancy.findByPk(vacancyId);

    if (!vacancy) {
        const error = new Error('Вакансия не найдена');
        error.status = 404;
        throw error;
    }

    vacancy.status = 'archived';
    await vacancy.save();

    return vacancy;
}

async function deleteVacancyById(vacancyId) {
    const vacancy = await Vacancy.findByPk(vacancyId);

    if (!vacancy) {
        const error = new Error('Вакансия не найдена');
        error.status = 404;
        throw error;
    }

    await vacancy.destroy();
}

module.exports = {
    getAllUsers,
    getAllVacancies,
    blockUserById,
    unpublishVacancyById,
    deleteVacancyById
};
