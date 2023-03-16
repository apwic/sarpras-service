const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const { ImageFacilityStorage } = require('../../../utils/storage');
const { facilityCategory } = require('../constant');

class BuildingUsecase {
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
                const fileURL = await ImageFacilityStorage.upload(facility.id, image);
                uploadedImages.push(fileURL);
            })
        );
    
        return uploadedImages;
    }
    
    static async __deleteImage(images) {
        await Promise.all(
            images.map(async (image) => {
                await ImageFacilityStorage.delete(image);
            })
        );
    }

    static async create(data, files, userId) {
		const facility = await createFacility(data, userId, facilityCategory.BUILDING);
		const images = files.image || [];
		const uploadedImages = await uploadImage(images, facility);

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

		return {
			message: 'Facility Building created succesfully',
		};
	}

    static async get(id) {
		let facility = await FacilityRepository.getFacility(id);
		let building = await FacilityRepository.getBuilding(id);

		facility = facility ? facility.dataValues : null;
		building = building ? building.dataValues : null;

		if (!facility || !building) {
			return {
				message: 'Facility Building not found',
			};
		}

		const campus = await CampusRepository.getCampus(building.campus_id);
		delete building.campus_id;

		return {
			message: 'Facility Building retrieved succesfully',
			data: {
				...facility,
				...building,
				campus: campus,
			},
		};
	}

	static async delete(id) {
		const facility = await FacilityRepository.getFacility(id);
		const building = await FacilityRepository.getBuilding(id);

		if (!facility || !building) {
			return {
				message: 'Facility is not a building',
			};
		}

		const images = building.image || [];
		await deleteImage(images);

		await FacilityRepository.deleteFacility(id);

		return {
			message: 'Facility Building deleted succesfully',
		};
	}

	static async update(id, data, files) {
		const facility = await FacilityRepository.getFacility(id);
		const building = await FacilityRepository.getBuilding(id);

		if (!facility || !building) {
			return {
				message: 'Facility Building not found',
			};
		}

		const images = building.image || [];
		const newImages = files.image || [];
		const uploadedImages = await uploadImage(newImages, facility);

		const buildingData = {
			id: id,
			campus_id: data.campus_id || building.campus_id,
			name: data.name || building.name,
			image: uploadedImages,
			capacity: data.capacity || building.capacity,
			latitude: data.latitude || building.latitude,
			longitude: data.longitude || building.longitude,
			status_maintenance: data.status_maintenance || building.status_maintenance,
		};

		await FacilityRepository.updateBuilding(buildingData);
		await updateFacility(data, facility);
		await deleteImage(images);

		return {
			message: 'Facility Building updated succesfully',
		};
	}
}

module.exports = BuildingUsecase;