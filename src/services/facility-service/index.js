const CampusRepository = require('../../repositories/campus-repository');
const FacilityRepository = require('../../repositories/facility-repository');
const { ImageFacility } = require('../../utils/storage');
const { facilityCategory } = require('./constant');

async function createFacility(data, userId, category) {
	const facilityData = {
		pic_id: data.pic_id || userId,
		category: category,
		electricity: data.electricity || null,
		utility: data.utility || null,
		price: data.price,
		description: data.description,
		not_available: data.not_available || null,
	};

	const facility = FacilityRepository.createFacility(facilityData);
	return facility;
}

async function updateFacility(data, facility) {
	const facilityData = {
		id: id,
		pic_id: data.pic_id || facility.pic_id,
		category: facilityCategory.VEHICLE,
		electricity: data.electricity || facility.electricity,
		utility: data.utility || facility.utility,
		price: data.price || facility.price,
		description: data.description || facility.description,
		not_available: data.not_available || facility.not_available,
	};

	await FacilityRepository.updateFacility(facilityData);
}

async function uploadImage(files) {
	const uploadedImages = [];
	const images = files.image || [];

	await Promise.all(
		images.map(async (image) => {
			const fileURL = await ImageFacility.upload(facility.id, image);
			uploadedImages.push(fileURL);
		})
	);

	return uploadedImages;
}

async function deleteImage(images) {
	await Promise.all(
		images.map(async (image) => {
			await ImageFacility.delete(image);
		})
	);
}

class FacilityService {
	static async createFacilityVehicle(data, files, userId) {
		const facility = await createFacility(data, userId, facilityCategory.VEHICLE);
		const uploadedImages = await uploadImage(files);

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

	static async getFacilityVehicle(id) {
		const facility = (await FacilityRepository.getFacility(id)).dataValues;
		const vehicle = (await FacilityRepository.getVehicle(id)).dataValues;

		const campusName = await CampusRepository.getCampus(vehicle.campus_id);
		delete vehicle.campus_id;

		return {
			message: 'Facility Vehicle retrieved succesfully',
			data: {
				...facility,
				...vehicle,
				campus: campusName,
			}
		};
	}

	static async deleteFacilityVehicle(id) {
		const facility = await FacilityRepository.getFacility(id);

		if (facility.category !== 'VEHICLE') {
			return {
				message: 'Facility is not a vehicle',
			};
		}

		const vehicle = await FacilityRepository.getVehicle(id);

		const images = vehicle.image || [];
		await deleteImage(images);

		await FacilityRepository.deleteFacility(id);

		return {
			message: 'Facility Vehicle deleted succesfully',
		};
	}

	static async updateFacilityVehicle(id, data, files) {
		const facility = await FacilityRepository.getFacility(id);

		if (facility.category !== facilityCategory.VEHICLE) {
			return {
				message: 'Facility is not a vehicle',
			};
		}

		const vehicle = await FacilityRepository.getVehicle(id);

		const images = vehicle.image || [];
		const newImages = files.image || [];

		const uploadedImages = await uploadImage(newImages);

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
		};

		await FacilityRepository.updateVehicle(vehicleData);
		await updateFacility(data, facility);
		await deleteImage(images);

		return {
			message: 'Facility Vehicle updated succesfully',
		};
	}

	static async createFacilityBuilding(data, files, userId) {
		const facility = await createFacility(data, userId, facilityCategory.BUILDING);
		const uploadedImages = await uploadImage(files);

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

	static async getFacilityBuilding(id) {
		const facility = (await FacilityRepository.getFacility(id)).dataValues;
		const building = (await FacilityRepository.getBuilding(id)).dataValues;

		const campusName = await CampusRepository.getCampus(building.campus_id);
		delete building.campus_id;

		return {
			message: 'Facility Building retrieved succesfully',
			data: {
				...facility,
				...building,
				campus: campusName,
			}
		};
	}

	static async deleteFacilityBuilding(id) {
		const facility = await FacilityRepository.getFacility(id);

		if (facility.category !== facilityCategory.BUILDING) {
			return {
				message: 'Facility is not a building',
			};
		}

		const building = await FacilityRepository.getBuilding(id);

		const images = building.image || [];
		await deleteImage(images);

		await FacilityRepository.deleteFacility(id);

		return {
			message: 'Facility Building deleted succesfully',
		};
	}

	static async updateFacilityBuilding(id, data, files) {
		const facility = await FacilityRepository.getFacility(id);

		if (facility.category !== facilityCategory.BUILDING) {
			return {
				message: 'Facility is not a building',
			};
		}

		const building = await FacilityRepository.getBuilding(id);

		const images = building.image || [];
		const newImages = files.image || [];

		const uploadedImages = await uploadImage(newImages);

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

module.exports = FacilityService;
