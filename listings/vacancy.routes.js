const express = require('express');
const vacancyController = require('../controllers/vacancy.controller');
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get(
    '/my',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.getMyVacancies
);

router.post(
    '/my/:id/skills',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.addSkillToMyVacancy
);

router.delete(
    '/my/:id/skills/:skillId',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.removeSkillFromMyVacancy
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.updateMyVacancy
);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.createVacancy
);

router.get(
    '/',
    vacancyController.getPublishedVacancies
);

router.get(
    '/:id/applications',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    applicationController.getApplicationsForMyVacancy
);

router.get(
    '/:id',
    vacancyController.getPublishedVacancyById
);

router.patch(
    '/:id/publish',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER),
    vacancyController.publishMyVacancy
);



router.patch(
    '/:id/unpublish',
    authMiddleware,
    roleMiddleware(ROLES.EMPLOYER, ROLES.ADMIN),
    vacancyController.unpublishMyVacancy
);

module.exports = router;