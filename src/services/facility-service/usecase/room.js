const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const { ImageFacilityStorage } = require('../../../utils/storage');
const LoggingService = require('../../logging-service');
const { facilityCategory } = require('../constant');
const { catchThrows } = require('../../../utils/promise');

class RoomUsecase {
    static async __createFacility(data, userId, category) {
        const facilityData = {
            pic_id: data.pic_id || userId,
            category: category,
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

    static async __filterRoom(filter) {
        const vehicleFilter = {};

        if (filter.facility_building_id) {
            vehicleFilter.facility_building_id = filter.facility_building_id;
        }

        if (filter.status_maintenance) {
            vehicleFilter.status_maintenance = filter.status_maintenance;
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

    static async create(data, files, userId) {
        const facility = await this.__createFacility(
            data,
            userId,
            facilityCategory.ROOM,
        );
        const images = files.image || [];
        const uploadedImages = await this.__uploadImage(images, facility);

        const roomData = {
            id: facility.id,
            facility_building_id: data.facility_building_id,
            name: data.name,
            room_code: data.room_code,
            image: uploadedImages,
            capacity: data.capacity,
            status_maintenance: data.status_maintenance || false,
        };
        await FacilityRepository.createRoom(roomData);

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
            message: 'Facility Room created succesfully',
        };
    }

    static async get(id) {
        let facility = await FacilityRepository.getFacility(id);
        let room = await FacilityRepository.getRoom(id);

        facility = facility ? facility.dataValues : null;
        room = room ? room.dataValues : null;

        if (!facility || !room) {
            return {
                message: 'Facility Room not found',
            };
        }

        const building = await FacilityRepository.getBuilding(
            room.facility_building_id,
        );
        delete room.facility_building_id;

        const campus = await CampusRepository.getCampus(building.campus_id);
        delete room.campus_id;

        return {
            message: 'Facility Room retrieved succesfully',
            data: {
                ...facility,
                ...room,
                building: building,
                campus: campus,
            },
        };
    }

    static async delete(id, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const room = await FacilityRepository.getRoom(id);

        if (!facility || !room) {
            return {
                message: 'Facility is not a room',
            };
        }

        const oldData = await this.get(id);

        const images = room.image || [];
        await this.__deleteImage(images);
        await FacilityRepository.deleteFacility(id);

        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                id,
                oldData.data,
                null,
            ),
        );

        return {
            message: 'Facility Room deleted succesfully',
        };
    }

    static async update(id, data, files, userId) {
        const facility = await FacilityRepository.getFacility(id);
        const room = await FacilityRepository.getRoom(id);

        if (!facility || !room) {
            return {
                message: 'Facility Room not found',
            };
        }

        const oldData = await this.get(id);

        const images = room.image || [];
        const newImages = files.image || [];
        const uploadedImages = await this.__uploadImage(newImages, facility);

        const roomData = {
            id: id,
            facility_building_id:
                data.facility_building_id || room.facility_building_id,
            name: data.name || room.name,
            room_code: data.room_code || room.room_code,
            image: uploadedImages,
            capacity: data.capacity || room.capacity,
            status_maintenance:
                data.status_maintenance || room.status_maintenance,
        };

        await FacilityRepository.updateRoom(roomData);
        await this.__updateFacility(data, facility);
        await this.__deleteImage(images);

        const newData = await this.get(id);
        await catchThrows(
            LoggingService.createLoggingFacility(
                userId,
                id,
                oldData.data,
                newData.data,
            ),
        );

        return {
            message: 'Facility Room updated succesfully',
        };
    }

    static async search(query, filter, page, limit) {
        const roomFilter = await this.__filterRoom(filter);
        const facilityFilter = await this.__filterFacility(filter);
        const offset = (page - 1) * limit;

        const rows = await FacilityRepository.searchRooms(
            query,
            roomFilter,
            facilityFilter,
            offset,
            limit,
        );

        const totalRows = await FacilityRepository.countRooms(
            query,
            roomFilter,
            facilityFilter,
        );

        return {
            message: 'Facility Room retrieved succesfully',
            data: {
                total_rows: totalRows,
                rows: rows,
            },
        };
    }
}

module.exports = RoomUsecase;
