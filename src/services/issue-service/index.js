const IssueRepository = require('../../repositories/issue-repository');
const UserRepository = require('../../repositories/user-repository');
const { catchThrows } = require('../../utils/promise');

const { ImageIssueStorage } = require('../../utils/storage');
const { issueStatus, issueStaffRoles } = require('./constant');

class IssueService {
    static async __uploadImage(images) {
        const uploadedImages = [];

        await Promise.all(
            images.map(async (image) => {
                const fileURL = await ImageIssueStorage.upload(image);
                uploadedImages.push(fileURL);
            }),
        );

        return uploadedImages;
    }

    static async __deleteImage(images) {
        await Promise.all(
            images.map(async (image) => {
                await ImageIssueStorage.delete(image);
            }),
        );
    }

    static async __accessValidation(oldIssue, userId) {
        const user = await UserRepository.getUserById(userId);

        const userRole = user.role;
        if (
            issueStaffRoles.includes(userRole) ||
            oldIssue.user_creator_id === userId
        ) {
            return true;
        }

        return false;
    }

    static async __filterIssue(filter) {
        const issueFilter = {};

        if (filter.user_creator_id) {
            issueFilter.user_creator_id = filter.user_creator_id;
        }

        if (filter.user_assigned_id) {
            issueFilter.user_assigned_id = filter.user_assigned_id;
        }

        if (filter.category) {
            issueFilter.category = filter.category;
        }

        if (filter.status) {
            issueFilter.status = filter.status;
        }

        return issueFilter;
    }

    static async createIssue(data, files, userId) {
        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images);

        const issueData = {
            user_creator_id: userId,
            user_assigned_id: data.user_assigned_id || null,
            title: data.title,
            category: data.category,
            status: issueStatus.PENDING,
            image: uploadedImages,
            description: data.description,
        };

        await IssueRepository.createIssue(issueData);

        return {
            message: 'Laporan berhasil dibuat',
        };
    }

    static async getIssue(id, userId) {
        const issue = await IssueRepository.getIssue(id);

        if (!(await this.__accessValidation(issue, userId))) {
            return {
                error_message:
                    'Anda tidak memiliki akses untuk melihat laporan',
            };
        }

        return {
            message: 'Laporan berhasil didapatkan',
            data: issue,
        };
    }

    static async updateIssue(id, data, files, userId) {
        const oldIssue = await IssueRepository.getIssue(id);

        if (!(await this.__accessValidation(oldIssue, userId))) {
            return {
                error_message:
                    'Anda tidak memiliki akses untuk mengubah laporan',
            };
        }

        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images);

        const issueData = {
            id,
            user_creator_id: oldIssue.user_creator_id,
            user_assigned_id:
                data.user_assigned_id || oldIssue.user_assigned_id,
            title: data.title || oldIssue.title,
            category: data.category || oldIssue.category,
            status: data.status || oldIssue.status,
            image: uploadedImages,
            description: data.description || oldIssue.description,
        };

        await IssueRepository.updateIssue(issueData);
        catchThrows(this.__deleteImage(oldIssue.image));

        return {
            message: 'Laporan berhasil diubah',
        };
    }

    static async deleteIssue(id, userId) {
        const issue = await IssueRepository.getIssue(id);

        if (issue.user_creator_id !== userId) {
            return {
                error_message:
                    'Anda tidak memiliki akses untuk menghapus laporan',
            };
        }

        await IssueRepository.deleteIssueById(id);
        catchThrows(this.__deleteImage(issue.image));

        return {
            message: 'Laporan berhasil dihapus',
        };
    }

    static async getMyIssues(userId) {
        const issues = await IssueRepository.getIssuesByUserId(userId);

        return {
            message: 'Laporan berhasil didapatkan',
            data: issues,
        };
    }

    static async searchIssues(query, filter, page, limit) {
        const issueFilter = await this.__filterIssue(filter);
        const offset = (page - 1) * limit;

        const data = await IssueRepository.searchIssues(
            query,
            issueFilter,
            offset,
            limit,
        );

        return {
            message: 'Laporan berhasil didapatkan',
            data: {
                total_rows: data.count,
                rows: data.rows,
            },
        };
    }
}

module.exports = IssueService;
