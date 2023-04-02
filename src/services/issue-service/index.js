const IssueRepository = require('../../repositories/issue-repository');
const { catchThrows } = require('../../utils/promise');

const { ImageIssueStorage } = require('../../utils/storage');
const { issueStatus } = require('./constant');

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

    static async getIssue(id) {
        const issue = await IssueRepository.getIssue(id);

        return {
            message: 'Laporan berhasil didapatkan',
            data: issue,
        };
    }

    static async updateIssue(id, data, files) {
        const oldIssue = await IssueRepository.getIssue(id);

        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images);

        const issueData = {
            id,
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

    static async deleteIssue(id) {
        const issue = await IssueRepository.getIssue(id);

        await IssueRepository.deleteIssue(id);
        catchThrows(this.__deleteImage(issue.image));

        return {
            message: 'Laporan berhasil dihapus',
        };
    }
}

module.exports = IssueService;
