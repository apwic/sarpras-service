const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const BookingRepository = require('../../../repositories/booking-repository');

const { ImageFacilityStorage } = require('../../../utils/storage');
const LoggingService = require('../../logging-service');
const { facilityCategory } = require('../constant');
const { catchThrows } = require('../../../utils/promise');

class VehicleUsecase {
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

    static async __filterVehicle(filter) {
        const vehicleFilter = {};

        if (filter.type) {
            vehicleFilter.type = filter.type;
        }

        if (filter.status_maintenance !== undefined) {
            vehicleFilter.status_maintenance = filter.status_maintenance;
        }

        if (filter.sim_category) {
            vehicleFilter.sim_category = filter.sim_category;
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

    static async create(data, files, userId) {
        const facility = await this.__createFacility(
            data,
            userId,
            facilityCategory.VEHICLE,
        );
        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images, facility);

        const vehicleData = {
            id: facility.id,
            campus_id: data.campus_id,
            name: data.name,
            type: data.type,
            sim_category: data.sim_category,
            license_number: data.license_number,
            vehicle_capacity: data.vehicle_capacity,
            image: uploadedImages,
            status_maintenance: data.status_maintenance || false,
        };
        await FacilityRepository.createVehicle(vehicleData);

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
            message: 'Fasilitas Kendaraan berhasil dibuat!',
        };
    }

    static async get(id) {
        let facility = await FacilityRepository.getFacility(id);
        let vehicle = await FacilityRepository.getVehicle(id);

        facility = facility ? facility.dataValues : null;
        vehicle = vehicle ? vehicle.dataValues : null;

        if (!facility || !vehicle) {
            return {
                message: 'Fasilitas Kendaraan tidak ditemukan!',
            };
        }

        const campus = await CampusRepository.getCampus(vehicle.campus_id);
        delete vehicle.campus_id;

        return {
            message: 'Fasilitas Kendaraan berhasil ditemukan!',
            data: {
                ...facility,
                ...vehicle,
                campus: campus,
            },
        };
    }

    static async delete(id, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const vehicle = await FacilityRepository.getVehicle(id);

        if (!facility || !vehicle) {
            return {
                error_message: 'Fasilitas Kendaraan tidak ditemukan!',
            };
        }

        if (await this.__checkFacilityInBooking(id)) {
            return {
                error_message: 'Fasilitas Kendaraan tidak dapat dihapus!',
            };
        }

        const oldData = await this.get(facility.id);

        await FacilityRepository.deleteFacility(id);
        await FacilityRepository.deleteVehicle(id);

        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                facility.id,
                oldData.data,
                null,
            ),
        );

        return {
            message: 'Fasilitas Kendaraan berhasil dihapus!',
        };
    }

    static async update(id, data, files, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const vehicle = await FacilityRepository.getVehicle(id);

        if (!facility || !vehicle) {
            return {
                message: 'Fasilitas Kendaraan tidak ditemukan!',
            };
        }

        const oldData = this.get(id);

        const images = vehicle.image || [];
        const newImages = files.image || [];

        const uploadedImages = await this.__uploadImage(newImages, facility);

        const vehicleData = {
            id: id,
            campus_id: data.campus_id || vehicle.campus_id,
            name: data.name || vehicle.name,
            type: data.type || vehicle.type,
            sim_category: data.sim_category || vehicle.sim_category,
            license_number: data.license_number || vehicle.license_number,
            vehicle_capacity: data.vehicle_capacity || vehicle.vehicle_capacity,
            image: uploadedImages,
            status_maintenance:
                data.status_maintenance !== undefined
                    ? data.status_maintenance
                    : vehicle.status_maintenance,
        };

        await FacilityRepository.updateVehicle(vehicleData);
        await this.__updateFacility(data, facility);
        await this.__deleteImage(images);

        const newData = await this.get(facility.id);
        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                facility.id,
                oldData.data,
                newData.data,
            ),
        );

        return {
            message: 'Fasilitas Kendaraan berhasil diubah!',
        };
    }

    static async search(query, filter, page, limit) {
        const vehicleFilter = await this.__filterVehicle(filter);
        const facilityFilter = await this.__filterFacility(filter);
        const offset = (page - 1) * limit;

        const rows = await FacilityRepository.searchVehicles(
            query,
            vehicleFilter,
            facilityFilter,
            offset,
            limit,
        );

        const totalRows = await FacilityRepository.countVehicles(
            query,
            vehicleFilter,
            facilityFilter,
        );

        return {
            message: 'Fasilitas Kendaraan berhasil ditemukan!',
            data: {
                total_rows: totalRows,
                rows: rows,
            },
        };
    }
}

module.exports = VehicleUsecase;
