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

    static async deleteFacilityVehicle(id, userId) {
        return await VehicleUsecase.delete(id, userId);
    }

    static async updateFacilityVehicle(id, data, files, userId) {
        return await VehicleUsecase.update(id, data, files, userId);
    }

    static async searchFacilityVehicle(query, filter, page, limit) {
        return await VehicleUsecase.search(query, filter, page, limit);
    }

    static async createFacilityBuilding(data, files, userId) {
        return await BuildingUsecase.create(data, files, userId);
    }

    static async getFacilityBuilding(id) {
        return await BuildingUsecase.get(id);
    }

    static async deleteFacilityBuilding(id, userId) {
        return await BuildingUsecase.delete(id, userId);
    }

    static async updateFacilityBuilding(id, data, files, userId) {
        return await BuildingUsecase.update(id, data, files, userId);
    }

    static async searchFacilityBuilding(query, filter, page, limit) {
        return await BuildingUsecase.search(query, filter, page, limit);
    }

    static async createFacilityRoom(data, files, userId) {
        return await RoomUsecase.create(data, files, userId);
    }

    static async getFacilityRoom(id) {
        return await RoomUsecase.get(id);
    }

    static async deleteFacilityRoom(id, userId) {
        return await RoomUsecase.delete(id, userId);
    }

    static async updateFacilityRoom(id, data, files, userId) {
        return await RoomUsecase.update(id, data, files, userId);
    }

    static async searchFacilityRoom(query, filter, page, limit) {
        return await RoomUsecase.search(query, filter, page, limit);
    }

    static async createFacilitySelasar(data, files, userId) {
        return await SelasarUsecase.create(data, files, userId);
    }

    static async getFacilitySelasar(id) {
        return await SelasarUsecase.get(id);
    }

    static async deleteFacilitySelasar(id, userId) {
        return await SelasarUsecase.delete(id, userId);
    }

    static async updateFacilitySelasar(id, data, files, userId) {
        return await SelasarUsecase.update(id, data, files, userId);
    }

    static async searchFacilitySelasar(query, filter, page, limit) {
        return await SelasarUsecase.search(query, filter, page, limit);
    }
}

module.exports = FacilityService;
