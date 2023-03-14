const FacilityRepository = require('../../repositories/facility-repository');
const { ImageFacility } = require('../../utils/storage');

class FacilityService {
    static async createFacilityVehicle(data, files, userId) {
        const facilityData = {
            pic_id: data.pic_id || userId,
            category: 'VEHICLE',
            electricity: data.electricity || null,
            utility: data.utility || null,
            price: data.price,
            description: data.description,
        }
        const facility = await FacilityRepository.createFacility(facilityData);

        const uploadedImages = [];
        const images = files.image || [];

        await Promise.all(
            images.map(async (image) => {
                const fileURL = await ImageFacility.upload(facility.id, image);
                uploadedImages.push(fileURL);
            })
        );

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
        }
        await FacilityRepository.createVehicle(vehicleData);

        return {
            message: 'Facility Vehicle created succesfully',
        };
    }

    static async getFacilityVehicle(id) {
        const facility = await FacilityRepository.getFacility(id);
        const vehicle = await FacilityRepository.getVehicle(id);

        return {
            ...facility,
            ...vehicle,
        }
    }

    static async deleteFacilityVehicle(id) {
        const facility = await FacilityRepository.getFacility(id);

        if (facility.category !== 'VEHICLE') {
            return {
                message: 'Facility is not a vehicle',
            }
        }

        const vehicle = await FacilityRepository.getVehicle(id);

        const images = vehicle.image || [];
        await Promise.all(
            images.map(async (image) => {
                await ImageFacility.delete(image);
            }
        ));

        await FacilityRepository.deleteFacility(id);

        return {
            message: 'Facility Vehicle deleted succesfully',
        };
    }

    static async updateFacilityVehicle(id, data, files) {
        const facility = await FacilityRepository.getFacility(id);

        if (facility.category !== 'VEHICLE') {
            return {
                message: 'Facility is not a vehicle',
            }
        }

        const vehicle = await FacilityRepository.getVehicle(id);
        const images = vehicle.image || [];

        const uploadedImages = [];
        const newImages = files.image || [];

        await Promise.all(
            newImages.map(async (image) => {
                const fileURL = await ImageFacility.upload(id, image);
                uploadedImages.push(fileURL);
            })
        );

        const vehicleData = {
            id: id,
            campus_id: data.campus_id || vehicle.campus_id,
            name: data.name || vehicle.name,
            type: data.type || vehicle.type,
            sim_category: data.sim_category || vehicle.sim_category,
            license_number: data.license_number || vehicle.license_number,
            vehicle_capacity: data.vehicle_capacity || vehicle.vehicle_capacity,
            image: uploadedImages,
            status_maintenance: data.status_maintenance || vehicle.status_maintenance,
        }
        await FacilityRepository.updateVehicle(vehicleData);

        const facilityData = {
            id: id,
            pic_id: data.pic_id || facility.pic_id,
            category: 'VEHICLE',
            electricity: data.electricity || facility.electricity,
            utility: data.utility || facility.utility,
            price: data.price || facility.price,
            description: data.description || facility.description,
        }
        await FacilityRepository.updateFacility(facilityData);

        await Promise.all(
            images.map(async (image) => {
                await ImageFacility.delete(image);
            }
        ));

        return {
            message: 'Facility Vehicle updated succesfully',
        };
    }
}

module.exports = FacilityService;