const VehicleUsecase = require('./usecase/vehicle');
const BuildingUsecase = require('./usecase/building');

class FacilityService {
	static async createFacilityVehicle(data, files, userId) {
		return await VehicleUsecase.create(data, files, userId);
	}

	static async getFacilityVehicle(id) {
		return await VehicleUsecase.get(id);
	}

	static async deleteFacilityVehicle(id) {
		return await VehicleUsecase.delete(id);
	}

	static async updateFacilityVehicle(id, data, files) {
		return await VehicleUsecase.update(id, data, files);
	}

	static async createFacilityBuilding(data, files, userId) {
		return await BuildingUsecase.create(data, files, userId);
	}

	static async getFacilityBuilding(id) {
		return await BuildingUsecase.get(id);
	}

	static async deleteFacilityBuilding(id) {
		return await BuildingUsecase.delete(id);
	}

	static async updateFacilityBuilding(id, data, files) {
		return await BuildingUsecase.update(id, data, files);
	}
}

module.exports = FacilityService;
