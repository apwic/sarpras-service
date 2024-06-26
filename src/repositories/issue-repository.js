const { models } = require('../db/index');
const { Op } = require('sequelize');

const StandardError = require('../utils/standard-error');

class IssueRepository {
    static async createIssue(issue) {
        try {
            return await models.Issue.create({
                user_creator_id: issue.user_creator_id,
                user_assigned_name: issue.user_assigned_name,
                title: issue.title,
                category: issue.category,
                status: issue.status,
                image: issue.image,
                description: issue.description,
                location: issue.location,
                is_deleted: false,
                video: issue.video,
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
                    is_deleted: false,
                },
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                        as: 'creator',
                    },
                ],
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
                    is_deleted: false,
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                        as: 'creator',
                    },
                ],
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
                    user_assigned_name: issue.user_assigned_name,
                    title: issue.title,
                    category: issue.category,
                    status: issue.status,
                    image: issue.image,
                    description: issue.description,
                    location: issue.location,
                    video: issue.video,
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

    static async updateIssueStatus(id, status) {
        try {
            return await models.Issue.update(
                {
                    status,
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
                'Error when updating issue status by id',
                err,
                {
                    id,
                    status,
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

    static async searchIssues(query, filter, offset, limit) {
        try {
            return await models.Issue.findAndCountAll({
                where: {
                    is_deleted: false,
                    ...filter,
                    [Op.or]: [
                        {
                            title: {
                                [Op.iLike]: `%${query}%`,
                            },
                        },
                        {
                            description: {
                                [Op.iLike]: `%${query}%`,
                            },
                        },
                        {
                            location: {
                                [Op.iLike]: `%${query}%`,
                            },
                        },
                        {
                            user_assigned_name: {
                                [Op.iLike]: `%${query}%`,
                            },
                        },
                    ],
                },
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                        as: 'creator',
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when searching issue',
                err,
                {
                    query,
                    filter,
                    offset,
                    limit,
                },
            );
        }
    }

    static async createReviewIssue(review) {
        try {
            return await models.ReviewIssue.create({
                issue_id: review.issue_id,
                rating: review.rating,
                description: review.description,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when creating review issue',
                err,
                {
                    review,
                },
            );
        }
    }

    static async getReviewIssueByIssueId(issueId) {
        try {
            return await models.ReviewIssue.findOne({
                where: {
                    issue_id: issueId,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when getting review issue by issue id',
                err,
                {
                    issueId,
                },
            );
        }
    }
}

module.exports = IssueRepository;
