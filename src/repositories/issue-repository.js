const { models } = require('../db/index');

const StandardError = require('../utils/standard-error');

class IssueRepository {
    static async createIssue(issue) {
        try {
            return await models.Issue.create({
                user_creator_id: issue.user_creator_id,
                user_assigned_id: issue.user_assigned_id,
                title: issue.title,
                category: issue.category,
                status: issue.status,
                image: issue.image,
                description: issue.description,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when creating issue',
                err,
                {
                    issue,
                },
            );
        }
    }

    static async getIssue(id) {
        try {
            return await models.Issue.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when getting issue by id',
                err,
                {
                    id,
                },
            );
        }
    }

    static async getIssuesByUserId(id) {
        try {
            return await models.Issue.findAll({
                where: {
                    user_creator_id: id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when getting issues by user id',
                err,
                {
                    id,
                },
            );
        }
    }

    static async updateIssue(issue) {
        try {
            return await models.Issue.update(
                {
                    user_creator_id: issue.user_creator_id,
                    user_assigned_id: issue.user_assigned_id,
                    title: issue.title,
                    category: issue.category,
                    status: issue.status,
                    image: issue.image,
                    description: issue.description,
                },
                {
                    where: {
                        id: issue.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when updating issue by id',
                err,
                {
                    issue,
                },
            );
        }
    }

    static async deleteIssueById(id) {
        try {
            return await models.Issue.update(
                {
                    is_deleted: true,
                },
                {
                    where: {
                        id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when deleting issue by id',
                err,
                {
                    id,
                },
            );
        }
    }
}

module.exports = IssueRepository;
