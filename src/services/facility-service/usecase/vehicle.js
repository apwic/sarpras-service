const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const { ImageFacilityStorage } = require('../../../utils/storage');
const { facilityCategory } = require('../constant');

class VehicleUsecase {
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

        return {
            message: 'Facility Vehicle created succesfully',
        };
    }

    static async get(id) {
        let facility = await FacilityRepository.getFacility(id);
        let vehicle = await FacilityRepository.getVehicle(id);

        facility = facility ? facility.dataValues : null;
        vehicle = vehicle ? vehicle.dataValues : null;

        if (!facility || !vehicle) {
            return {
                message: 'Facility Vehicle not found',
            };
        }

        const campus = await CampusRepository.getCampus(vehicle.campus_id);
        delete vehicle.campus_id;

        return {
            message: 'Facility Vehicle retrieved succesfully',
            data: {
                ...facility,
                ...vehicle,
                campus: campus,
            },
        };
    }

    static async delete(id) {
        const facility = await FacilityRepository.getFacility(id);
        const vehicle = await FacilityRepository.getVehicle(id);

        if (!facility || !vehicle) {
            return {
                message: 'Facility Vehicle not found',
            };
        }

        const images = vehicle.image || [];
        await this.__deleteImage(images);

        await FacilityRepository.deleteFacility(id);

        return {
            message: 'Facility Vehicle deleted succesfully',
        };
    }

    static async update(id, data, files) {
        const facility = await FacilityRepository.getFacility(id);
        const vehicle = await FacilityRepository.getVehicle(id);

        if (!facility || !vehicle) {
            return {
                message: 'Facility Vehicle not found',
            };
        }

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
                data.status_maintenance || vehicle.status_maintenance,
        };

        await FacilityRepository.updateVehicle(vehicleData);
        await this.__updateFacility(data, facility);
        await this.__deleteImage(images);

        return {
            message: 'Facility Vehicle updated succesfully',
        };
    }
}

module.exports = VehicleUsecase;
