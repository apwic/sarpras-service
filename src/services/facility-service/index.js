const VehicleUsecase = require('./usecase/vehicle');
const BuildingUsecase = require('./usecase/building');
const RoomUsecase = require('./usecase/room');
const SelasarUsecase = require('./usecase/selasar');

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

    static async createFacilityRoom(data, files, userId) {
        return await RoomUsecase.create(data, files, userId);
    }

    static async getFacilityRoom(id) {
        return await RoomUsecase.get(id);
    }

    static async deleteFacilityRoom(id) {
        return await RoomUsecase.delete(id);
    }

    static async updateFacilityRoom(id, data, files) {
        return await RoomUsecase.update(id, data, files);
    }

    static async createFacilitySelasar(data, files, userId) {
        return await SelasarUsecase.create(data, files, userId);
    }

    static async getFacilitySelasar(id) {
        return await SelasarUsecase.get(id);
    }

    static async deleteFacilitySelasar(id) {
        return await SelasarUsecase.delete(id);
    }

    static async updateFacilitySelasar(id, data, files) {
        return await SelasarUsecase.update(id, data, files);
    }
}

module.exports = FacilityService;
