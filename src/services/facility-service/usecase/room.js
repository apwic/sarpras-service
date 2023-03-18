const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const { ImageFacilityStorage } = require('../../../utils/storage');
const { facilityCategory } = require('../constant');

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
                await ImageFacilityStorage.delete(image);
            }),
        );
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

    static async delete(id) {
        const facility = await FacilityRepository.getFacility(id);
        const room = await FacilityRepository.getRoom(id);

        if (!facility || !room) {
            return {
                message: 'Facility is not a room',
            };
        }

        const images = room.image || [];
        await this.__deleteImage(images);

        await FacilityRepository.deleteFacility(id);

        return {
            message: 'Facility Room deleted succesfully',
        };
    }

    static async update(id, data, files) {
        const facility = await FacilityRepository.getFacility(id);
        const room = await FacilityRepository.getRoom(id);

        if (!facility || !room) {
            return {
                message: 'Facility Room not found',
            };
        }

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

        return {
            message: 'Facility Room updated succesfully',
        };
    }
}

module.exports = RoomUsecase;
