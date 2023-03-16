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
		const facility = await this.__createFacility(data, userId, facilityCategory.SELASAR);
		const images = files.image || [];
		const uploadedImages = await this.__uploadImage(images, facility);

		const selasarData = {
			id: facility.id,
			facility_building_id: data.facility_building_id,
			name: data.name,
			image: uploadedImages,
			capacity: data.capacity,
			status_maintenance: data.status_maintenance || false,
		};
		await FacilityRepository.createSelasar(selasarData);

		return {
			message: 'Facility Selasar created succesfully',
		};
	}

    static async get(id) {
		let facility = await FacilityRepository.getFacility(id);
		let selasar = await FacilityRepository.getSelasar(id);

		facility = facility ? facility.dataValues : null;
		selasar = selasar ? selasar.dataValues : null;

		if (!facility || !selasar) {
			return {
				message: 'Facility Selasar not found',
			};
		}

        const building = await FacilityRepository.getBuilding(selasar.facility_building_id);
        delete selasar.facility_building_id;

		const campus = await CampusRepository.getCampus(building.campus_id);
		delete selasar.campus_id;

		return {
			message: 'Facility Selasar retrieved succesfully',
			data: {
				...facility,
				...selasar,
                building: building,
				campus: campus,
			},
		};
	}

	static async delete(id) {
		const facility = await FacilityRepository.getFacility(id);
		const selasar = await FacilityRepository.getSelasar(id);

		if (!facility || !selasar) {
			return {
				message: 'Facility is not a selasar',
			};
		}

		const images = selasar.image || [];
		await this.__deleteImage(images);

		await FacilityRepository.deleteFacility(id);

		return {
			message: 'Facility selasar deleted succesfully',
		};
	}

	static async update(id, data, files) {
		const facility = await FacilityRepository.getFacility(id);
		const selasar = await FacilityRepository.getSelasar(id);

		if (!facility || !selasar) {
			return {
				message: 'Facility selasar not found',
			};
		}

		const images = selasar.image || [];
		const newImages = files.image || [];
		const uploadedImages = await this.__uploadImage(newImages, facility);

		const selasarData = {
			id: id,
			facility_building_id: data.facility_building_id || selasar.facility_building_id,
			name: data.name || selasar.name,
			image: uploadedImages,
			capacity: data.capacity || selasar.capacity,
			status_maintenance: data.status_maintenance || selasar.status_maintenance,
		};

		await FacilityRepository.updateSelasar(selasarData);
		await this.__updateFacility(data, facility);
		await this.__deleteImage(images);

		return {
			message: 'Facility Selasar updated succesfully',
		};
	}
}

module.exports = RoomUsecase;