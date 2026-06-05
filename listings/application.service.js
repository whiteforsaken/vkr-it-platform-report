const { Application, CandidateProfile, Vacancy, Company, User, Skill } = require('../../models');

async function createApplication(userId, vacancyId) {
    const profile = await CandidateProfile.findOne({
        where: { userId }
    });

    if (!profile) {
        const error = new Error('Candidate profile not found');
        error.status = 404;
        throw error;
    }

    const vacancy = await Vacancy.findOne({
        where: {
            id: vacancyId,
            status: 'published'
        }
    });

    if (!vacancy) {
        const error = new Error('Вакансия не найдена');
        error.status = 404;
        throw error;
    }

    const existingApplication = await Application.findOne({
        where: {
            vacancyId: vacancy.id,
            profileId: profile.id
        }
    });

    if (existingApplication) {
        const error = new Error('Вы уже откликнулись на эту вакансию');
        error.status = 400;
        throw error;
    }

    const application = await Application.create({
        vacancyId: vacancy.id,
        profileId: profile.id,
        status: 'new'
    });

    return application;
}


async function getMyApplications(userId) {
    const profile = await CandidateProfile.findOne({
        where: { userId }
    });

    if (!profile) {
        const error = new Error('Candidate profile not found');
        error.status = 404;
        throw error;
    }

    const applications = await Application.findAll({
        where: {
            profileId: profile.id
        },
        include: [
            {
                model: Vacancy,
                as: 'vacancy',
                include: [
                    {
                        model: Company,
                        as: 'company',
                        attributes: ['id', 'name', 'website']
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    });

    return applications;
}

async function getApplicationsForMyVacancy(userId, vacancyId) {
    const company = await Company.findOne({
        where: { userId }
    });

    if (!company) {
        const error = new Error('Company profile not found');
        error.status = 404;
        throw error;
    }

    const vacancy = await Vacancy.findOne({
        where: {
            id: vacancyId,
            companyId: company.id
        }
    });

    if (!vacancy) {
        const error = new Error('Вакансия не найдена');
        error.status = 404;
        throw error;
    }

    const applications = await Application.findAll({
        where: {
            vacancyId: vacancy.id
        },
        include: [
            {
                model: CandidateProfile,
                as: 'candidateProfile',
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'fullName']
                    },
                    {
                        model: Skill,
                        as: 'skills',
                        attributes: ['id', 'name'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    });

    return applications;
}

async function updateApplicationStatus(userId, applicationId, status) {
    const allowedStatuses = ['new', 'in_review', 'accepted', 'rejected'];

    if (!status || !allowedStatuses.includes(status)) {
        const error = new Error('Invalid application status');
        error.status = 400;
        throw error;
    }

    const company = await Company.findOne({
        where: { userId }
    });

    if (!company) {
        const error = new Error('Company profile not found');
        error.status = 404;
        throw error;
    }

    const application = await Application.findByPk(applicationId, {
        include: [
            {
                model: Vacancy,
                as: 'vacancy',
                include: [
                    {
                        model: Company,
                        as: 'company',
                        attributes: ['id', 'name', 'website']
                    }
                ]
            }
        ]
    });

    if (!application) {
        const error = new Error('Application not found');
        error.status = 404;
        throw error;
    }

    if (!application.vacancy || application.vacancy.companyId !== company.id) {
        const error = new Error('Application not found');
        error.status = 404;
        throw error;
    }

    application.status = status;
    await application.save();

    return application;
}

module.exports = {
    createApplication,
    getMyApplications,
    getApplicationsForMyVacancy,
    updateApplicationStatus
};

