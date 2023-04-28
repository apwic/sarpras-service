const IssueRepository = require('../../repositories/issue-repository');
const UserRepository = require('../../repositories/user-repository');
const { catchThrows } = require('../../utils/promise');

const { ImageIssueStorage, VideoIssueStorage } = require('../../utils/storage');
const { issueStatus, issueStaffRoles } = require('./constant');

const LoggingService = require('../logging-service');
const NotificationService = require('../notification-service');

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

    static async __uploadVideo(videos) {
        const uploadedVideos = [];

        await Promise.all(
            videos.map(async (video) => {
                const fileURL = await VideoIssueStorage.upload(video);
                uploadedVideos.push(fileURL);
            }),
        );

        return uploadedVideos;
    }

    static async __deleteImage(images) {
        await Promise.all(
            images.map(async (image) => {
                await ImageIssueStorage.delete(image);
            }),
        );
    }

    static async __deleteVideo(videos) {
        await Promise.all(
            videos.map(async (video) => {
                await VideoIssueStorage.delete(video);
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

        if (filter.user_assigned_name) {
            issueFilter.user_assigned_name = filter.user_assigned_name;
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
        const videos = files.video || [];
        const uploadedImages = await this.__uploadImage(images);
        const uploadedVideos = await this.__uploadVideo(videos);

        const issueData = {
            user_creator_id: userId,
            user_assigned_name: data.user_assigned_name || null,
            title: data.title,
            category: data.category,
            status: issueStatus.PENDING,
            image: uploadedImages,
            description: data.description,
            location: data.location,
            video: uploadedVideos,
        };

        const issue = await IssueRepository.createIssue(issueData);

        const staffRole = issue.category + '_STAFF';
        const notificationMessage = `Laporan baru dengan judul ${issue.title} telah dibuat`;
        await catchThrows(
            NotificationService.createNotificationForRole(
                staffRole,
                notificationMessage,
            ),
        );

        await catchThrows(
            LoggingService.createLoggingIssue(userId, issue.id, null, issue),
        );

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

        const review = await IssueRepository.getReviewIssueByIssueId(id);

        const issueData = {
            ...issue.dataValues,
            review,
        };

        return {
            message: 'Laporan berhasil didapatkan',
            data: issueData,
        };
    }

    static async updateIssue(id, data, userId) {
        const oldIssue = await IssueRepository.getIssue(id);

        if (!(await this.__accessValidation(oldIssue, userId))) {
            return {
                error_message:
                    'Anda tidak memiliki akses untuk mengubah laporan',
            };
        }

        let userAssignedName;

        if (data.user_assigned_name === '') {
            userAssignedName = null;
        } else {
            userAssignedName =
                data.user_assigned_name || oldIssue.user_assigned_name;
        }

        const issueData = {
            id,
            user_creator_id: oldIssue.user_creator_id,
            user_assigned_name: userAssignedName,
            title: data.title || oldIssue.title,
            category: data.category || oldIssue.category,
            status: data.status || oldIssue.status,
            image: oldIssue.image,
            description: data.description || oldIssue.description,
            location: data.location || oldIssue.location,
            video: oldIssue.video,
        };

        await IssueRepository.updateIssue(issueData);

        if (data.status !== oldIssue.status) {
            const message = `Status laporan anda dengan judul ${issueData.title} telah berubah menjadi ${issueData.status}`;

            await catchThrows(
                NotificationService.createNotification(
                    oldIssue.user_creator_id,
                    message,
                ),
            );
        }

        await catchThrows(
            LoggingService.createLoggingIssue(userId, id, oldIssue, issueData),
        );

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
        await catchThrows(this.__deleteImage(issue.image));
        await catchThrows(this.__deleteVideo(issue.video));

        await catchThrows(
            LoggingService.createLoggingIssue(userId, id, issue, null),
        );

        return {
            message: 'Laporan berhasil dihapus',
        };
    }

    static async getMyIssues(query, filter, page, limit, userId) {
        filter.user_creator_id = userId;

        return await this.searchIssues(query, filter, page, limit);
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

    static async reviewIssue(body, userId) {
        const review = {
            issue_id: body.issue_id,
            rating: body.rating,
            description: body.description,
        };

        const issue = await IssueRepository.getIssue(body.issue_id);

        if (!issue) {
            return {
                error_message: 'Laporan tidak ditemukan',
            };
        }

        if (issue.status !== issueStatus.DONE) {
            return {
                error_message: 'Laporan belum selesai',
            };
        }

        if (issue.user_creator_id !== userId) {
            return {
                error_message:
                    'Anda tidak memiliki akses untuk memberikan review',
            };
        }

        const findIssueReview = await IssueRepository.getReviewIssueByIssueId(
            body.issue_id,
        );

        if (findIssueReview) {
            return {
                error_message: 'Anda sudah memberikan review',
            };
        }

        await IssueRepository.createReviewIssue(review);
        await IssueRepository.updateIssueStatus(
            body.issue_id,
            issueStatus.DONE,
        );

        return {
            message: 'Review berhasil dibuat',
        };
    }

    static async getReviewIssue(issueId) {
        const review = await IssueRepository.getReviewIssueByIssueId(issueId);

        if (!review) {
            return {
                error_message: 'Review tidak ditemukan',
            };
        }

        return {
            message: 'Review berhasil didapatkan',
            data: review,
        };
    }
}

module.exports = IssueService;
