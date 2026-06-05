const vacancyService = require('../services/vacancy.service');
const adminService = require('../services/admin.service');


async function createVacancy(req, res, next) {
    try {
        const vacancy = await vacancyService.createVacancy(req.user.id, req.body);

        return res.status(201).json({
            message: 'Vacancy created successfully',
            vacancy,
        });
    } catch (error) {
        next(error);
    }
}

async function getPublishedVacancies(req, res, next) {
    try {
        const vacancies = await vacancyService.getPublishedVacancies(req.query);

        return res.json({
            message: 'Vacancies fetched successfully',
            vacancies,
        });
    } catch (error) {
        next(error);
    }
}

async function getPublishedVacancyById(req, res, next) {
    try {
        if (!/^\d+$/.test(String(req.params.id))) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        const vacancy = await vacancyService.getPublishedVacancyById(req.params.id);

        return res.json({
            message: 'Vacancy fetched successfully',
            vacancy,
        });
    } catch (error) {
        next(error);
    }
}

async function getMyVacancies(req, res, next) {
    try {
        const vacancies = await vacancyService.getMyVacancies(req.user.id);

        return res.json({
            message: 'Vacancies fetched successfully',
            vacancies,
        });
    } catch (error) {
        next(error);
    }
}

async function addSkillToMyVacancy(req, res, next) {
    try {
        if (!/^\d+$/.test(String(req.params.id))) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        const skill = await vacancyService.addSkillToMyVacancy(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(201).json({
            message: 'Skill added to vacancy successfully',
            skill,
        });
    } catch (error) {
        next(error);
    }
}

async function removeSkillFromMyVacancy(req, res, next) {
    try {
        if (
            !/^\d+$/.test(String(req.params.id)) ||
            !/^\d+$/.test(String(req.params.skillId))
        ) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        await vacancyService.removeSkillFromMyVacancy(
            req.user.id,
            req.params.id,
            req.params.skillId
        );

        return res.json({
            message: 'Skill removed from vacancy successfully',
        });
    } catch (error) {
        next(error);
    }
}

async function publishMyVacancy(req, res, next) {
    try {
        if (!/^\d+$/.test(String(req.params.id))) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        const vacancy = await vacancyService.publishMyVacancy(
            req.user.id,
            req.params.id
        );

        return res.json({
            message: 'Vacancy published successfully',
            vacancy,
        });
    } catch (error) {
        next(error);
    }
}

async function unpublishMyVacancy(req, res, next) {
    try {
        if (!/^\d+$/.test(String(req.params.id))) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        let vacancy;

        if (req.user.role === 'admin') {
            vacancy = await adminService.unpublishVacancyById(req.params.id);
        } else {
            vacancy = await vacancyService.unpublishMyVacancy(
                req.user.id,
                req.params.id
            );
        }

        return res.json({
            message: 'Vacancy unpublished successfully',
            vacancy,
        });
    } catch (error) {
        next(error);
    }
}

async function updateMyVacancy(req, res, next) {
    try {
        if (!/^\d+$/.test(String(req.params.id))) {
            return res.status(404).json({
                message: 'Route not found',
            });
        }

        const vacancy = await vacancyService.updateMyVacancy(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.json({
            message: 'Vacancy updated successfully',
            vacancy,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createVacancy,
    getPublishedVacancies,
    getPublishedVacancyById,
    getMyVacancies,
    addSkillToMyVacancy,
    removeSkillFromMyVacancy,
    publishMyVacancy,
    unpublishMyVacancy,
    updateMyVacancy,
};