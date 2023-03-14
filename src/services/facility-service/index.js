const FacilityRepository = require('../../repositories/facility-repository');
const { uploadImageFacility } = require('../../utils/upload-file');

class FacilityService {
    static async createFacility(data, files, userId) {
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
        const images = files.image;
        await Promise.all(
            images.map(async (image) => {
                const fileURL = await uploadImageFacility(facility.id, image);
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

    static async getFacility(id) {
        const facility = await FacilityRepository.getFacility(id);
        return facility;
    }
}

module.exports = FacilityService;