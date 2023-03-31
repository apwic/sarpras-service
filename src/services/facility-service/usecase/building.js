const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const BookingRepository = require('../../../repositories/booking-repository');

const { ImageFacilityStorage } = require('../../../utils/storage');
const LoggingService = require('../../logging-service');
const { facilityCategory } = require('../constant');
const { catchThrows } = require('../../../utils/promise');

class BuildingUsecase {
    static async __createFacility(data, userId, category) {
        const facilityData = {
            pic_id: data.pic_id || userId,
            category: category,
            name: data.name,
            electricity: data.electricity || null,
            utility: data.utility || null,
            price: data.price,
            description: data.description,
            not_available: data.not_available || null,
        };

        const facility = await FacilityRepository.createFacility(facilityData);
        return facility;
    }

    static async __updateFacility(data, facility) {
        const facilityData = {
            id: facility.id,
            pic_id: data.pic_id || facility.pic_id,
            category: facility.category,
            name: data.name || facility.name,
            electricity: data.electricity || facility.electricity,
            utility: data.utility || facility.utility,
            price: data.price || facility.price,
            description: data.description || facility.description,
            not_available: data.not_available || facility.not_available,
        };

        await FacilityRepository.updateFacility(facilityData);
    }

    static async __uploadImage(images, facility) {
        const uploadedImages = [];

        await Promise.all(
            images.map(async (image) => {
                const fileURL = await ImageFacilityStorage.upload(
                    facility.id,
                    image,
                );
                uploadedImages.push(fileURL);
            }),
        );

        return uploadedImages;
    }

    static async __deleteImage(images) {
        await Promise.all(
            images.map(async (image) => {
                await catchThrows(ImageFacilityStorage.delete(image));
            }),
        );
    }

    static async __filterBuilding(filter) {
        const vehicleFilter = {};

        if (filter.status_maintenance !== undefined) {
            vehicleFilter.status_maintenance = filter.status_maintenance;
        }

        if (filter.campus_id) {
            vehicleFilter.campus_id = filter.campus_id;
        }

        return vehicleFilter;
    }

    static async __filterFacility(filter) {
        const facilityFilter = {};
        if (filter.pic_id) {
            facilityFilter.pic_id = filter.pic_id;
        }

        return facilityFilter;
    }

    static async __checkFacilityInBooking(id) {
        const booking = await BookingRepository.getBookingByFacilityId(id);
        return booking.length ? true : false;
    }

    static async __checkSelasarAndRoomInBooking(buildingId) {
        const bookedSelasarBuilding =
            await FacilityRepository.getBookedSelasarByBuildingId(buildingId);
        const bookedRoomBuilding =
            await FacilityRepository.getBookedRoomByBuildingId(buildingId);

        return bookedSelasarBuilding.length || bookedRoomBuilding.length
            ? true
            : false;
    }

    static async create(data, files, userId) {
        const facility = await this.__createFacility(
            data,
            userId,
            facilityCategory.BUILDING,
        );
        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images, facility);

        const buildingData = {
            id: facility.id,
            campus_id: data.campus_id,
            name: data.name,
            image: uploadedImages,
            capacity: data.capacity,
            latitude: data.latitude,
            longitude: data.longitude,
            status_maintenance: data.status_maintenance || false,
        };
        await FacilityRepository.createBuilding(buildingData);

        const newData = await this.get(facility.id);
        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                facility.id,
                null,
                newData.data,
            ),
        );

        return {
            message: 'Fasilitas Gedung berhasil dibuat!',
        };
    }

    static async get(id) {
        let facility = await FacilityRepository.getFacility(id);
        let building = await FacilityRepository.getBuilding(id);

        facility = facility ? facility.dataValues : null;
        building = building ? building.dataValues : null;

        if (!facility || !building) {
            return {
                message: 'Fasilitas Gedung tidak ditemukan!',
            };
        }

        const campus = await CampusRepository.getCampus(building.campus_id);
        delete building.campus_id;

        return {
            message: 'Fasilitas Gedung berhasil ditemukan!',
            data: {
                ...facility,
                ...building,
                campus: campus,
            },
        };
    }

    static async delete(id, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const building = await FacilityRepository.getBuilding(id);

        if (!facility || !building) {
            return {
                error_message: 'Fasilitas Gedung tidak ditemukan!',
            };
        }

        if (await this.__checkFacilityInBooking(id)) {
            return {
                error_message: 'Fasilitas Gedung digunakan pada booking!',
            };
        }

        if (await this.__checkSelasarAndRoomInBooking(id)) {
            return {
                error_message:
                    'Fasilitas Gedung digunakan pada booking selasar atau ruangan!',
            };
        }

        const oldData = await this.get(id);

        await FacilityRepository.deleteFacility(id);
        await FacilityRepository.deleteBuilding(id);

        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                facility.id,
                oldData.data,
                null,
            ),
        );

        return {
            message: 'Fasilitas Gedung berhasil dihapus!',
        };
    }

    static async update(id, data, files, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const building = await FacilityRepository.getBuilding(id);

        if (!facility || !building) {
            return {
                message: 'Fasilitas Gedung tidak ditemukan!',
            };
        }

        const oldData = await this.get(id);

        const images = building.image || [];
        const newImages = files.image || [];
        const uploadedImages = await this.__uploadImage(newImages, facility);

        const buildingData = {
            id: id,
            campus_id: data.campus_id || building.campus_id,
            name: data.name || building.name,
            image: uploadedImages,
            capacity: data.capacity || building.capacity,
            latitude: data.latitude || building.latitude,
            longitude: data.longitude || building.longitude,
            status_maintenance:
                data.status_maintenance !== undefined
                    ? data.status_maintenance
                    : building.status_maintenance,
        };

        await FacilityRepository.updateBuilding(buildingData);
        await this.__updateFacility(data, facility);
        await this.__deleteImage(images);

        const newData = await this.get(id);
        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                facility.id,
                oldData.data,
                newData.data,
            ),
        );

        return {
            message: 'Fasilitas Gedung berhasil diubah!',
        };
    }

    static async search(query, filter, page, limit) {
        const buildingFilter = await this.__filterBuilding(filter);
        const facilityFilter = await this.__filterFacility(filter);
        const offset = (page - 1) * limit;

        const rows = await FacilityRepository.searchBuildings(
            query,
            buildingFilter,
            facilityFilter,
            offset,
            limit,
        );

        const totalRows = await FacilityRepository.countBuildings(
            query,
            buildingFilter,
            facilityFilter,
        );

        return {
            message: 'Fasilitas Gedung berhasil ditemukan!',
            data: {
                total_rows: totalRows,
                rows: rows,
            },
        };
    }
}

module.exports = BuildingUsecase;
