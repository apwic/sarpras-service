const { models } = require('../db/index');
const { Op } = require('sequelize');

const StandardError = require('../utils/standard-error');

class FacilityRepository {
    static async createFacility(facility) {
        try {
            return await models.Facility.create({
                pic_id: facility.pic_id,
                category: facility.category,
                name: facility.name,
                electricity: facility.electricity,
                utility: facility.utility,
                price: facility.price,
                description: facility.description,
                not_available: facility.not_available,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    facility,
                },
            );
        }
    }

    static async getFacility(id) {
        try {
            return await models.Facility.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async deleteFacility(id) {
        try {
            await models.Facility.destroy({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async updateFacility(facility) {
        try {
            await models.Facility.update(
                {
                    pic_id: facility.pic_id,
                    category: facility.category,
                    name: facility.name,
                    electricity: facility.electricity,
                    utility: facility.utility,
                    price: facility.price,
                    description: facility.description,
                },
                {
                    where: {
                        id: facility.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    facility,
                },
            );
        }
    }

    static async createVehicle(vehicle) {
        try {
            return await models.FacilityVehicle.create({
                id: vehicle.id,
                campus_id: vehicle.campus_id,
                name: vehicle.name,
                type: vehicle.type,
                sim_category: vehicle.sim_category,
                license_number: vehicle.license_number,
                vehicle_capacity: vehicle.vehicle_capacity,
                image: vehicle.image,
                status_maintenance: vehicle.status_maintenance,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    vehicle,
                },
            );
        }
    }

    static async getVehicle(id) {
        try {
            return await models.FacilityVehicle.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async updateVehicle(vehicle) {
        try {
            await models.FacilityVehicle.update(
                {
                    campus_id: vehicle.campus_id,
                    name: vehicle.name,
                    type: vehicle.type,
                    sim_category: vehicle.sim_category,
                    license_number: vehicle.license_number,
                    vehicle_capacity: vehicle.vehicle_capacity,
                    image: vehicle.image,
                    status_maintenance: vehicle.status_maintenance,
                },
                {
                    where: {
                        id: vehicle.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    vehicle,
                },
            );
        }
    }

    static async searchVehicles(
        query,
        vehicleFilter,
        facilityFilter,
        offset,
        limit,
    ) {
        try {
            return await models.FacilityVehicle.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                        {
                            license_number: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...vehicleFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.Campus,
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async countVehicles(query, vehicleFilter, facilityFilter) {
        try {
            return await models.FacilityVehicle.count({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                        {
                            license_number: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...vehicleFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.Campus,
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async createBuilding(building) {
        try {
            return await models.FacilityBuilding.create({
                id: building.id,
                campus_id: building.campus_id,
                name: building.name,
                image: building.image,
                capacity: building.capacity,
                latitude: building.latitude,
                longitude: building.longitude,
                status_maintenance: building.status_maintenance,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    building,
                },
            );
        }
    }

    static async getBuilding(id) {
        try {
            return await models.FacilityBuilding.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async updateBuilding(building) {
        try {
            await models.FacilityBuilding.update(
                {
                    campus_id: building.campus_id,
                    name: building.name,
                    image: building.image,
                    capacity: building.capacity,
                    latitude: building.latitude,
                    longitude: building.longitude,
                    status_maintenance: building.status_maintenance,
                },
                {
                    where: {
                        id: building.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    building,
                },
            );
        }
    }

    static async getBuildings() {
        try {
            return await models.FacilityBuilding.findAll();
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {},
            );
        }
    }

    static async searchBuildings(
        query,
        buildingFilter,
        facilityFilter,
        offset,
        limit,
    ) {
        try {
            return await models.FacilityBuilding.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...buildingFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.Campus,
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async countBuildings(query, buildingFilter, facilityFilter) {
        try {
            return await models.FacilityBuilding.count({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...buildingFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.Campus,
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async createRoom(room) {
        try {
            return await models.FacilityRoom.create({
                id: room.id,
                facility_building_id: room.facility_building_id,
                name: room.name,
                room_code: room.room_code,
                image: room.image,
                capacity: room.capacity,
                status_maintenance: room.status_maintenance,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    room,
                },
            );
        }
    }

    static async getRoom(id) {
        try {
            return await models.FacilityRoom.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async getBookedRoomByBuildingId(buildingId) {
        try {
            return await models.FacilityRoom.findAll({
                where: {
                    facility_building_id: buildingId,
                },
                include: [
                    {
                        model: models.Facility,
                        include: [
                            {
                                model: models.Booking,
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    buildingId,
                },
            );
        }
    }

    static async updateRoom(room) {
        try {
            await models.FacilityRoom.update(
                {
                    facility_building_id: room.facility_building_id,
                    name: room.name,
                    room_code: room.room_code,
                    image: room.image,
                    capacity: room.capacity,
                    status_maintenance: room.status_maintenance,
                },
                {
                    where: {
                        id: room.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    room,
                },
            );
        }
    }

    static async searchRooms(query, roomFilter, facilityFilter, offset, limit) {
        try {
            return await models.FacilityRoom.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                        {
                            room_code: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...roomFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.FacilityBuilding,
                        include: [
                            {
                                model: models.Campus,
                            },
                        ],
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async countRooms(query, roomFilter, facilityFilter) {
        try {
            return await models.FacilityRoom.count({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                        {
                            room_code: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...roomFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.FacilityBuilding,
                        include: [
                            {
                                model: models.Campus,
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async createSelasar(selasar) {
        try {
            return await models.FacilitySelasar.create({
                id: selasar.id,
                facility_building_id: selasar.facility_building_id,
                name: selasar.name,
                image: selasar.image,
                capacity: selasar.capacity,
                status_maintenance: selasar.status_maintenance,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    selasar,
                },
            );
        }
    }

    static async getSelasar(id) {
        try {
            return await models.FacilitySelasar.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async getBookedSelasarByBuildingId(buildingId) {
        try {
            return await models.FacilitySelasar.findAll({
                where: {
                    facility_building_id: buildingId,
                },
                include: [
                    {
                        model: models.Facility,
                        include: [
                            {
                                model: models.Booking,
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    buildingId,
                },
            );
        }
    }

    static async updateSelasar(selasar) {
        try {
            await models.FacilitySelasar.update(
                {
                    facility_building_id: selasar.facility_building_id,
                    name: selasar.name,
                    image: selasar.image,
                    capacity: selasar.capacity,
                    status_maintenance: selasar.status_maintenance,
                },
                {
                    where: {
                        id: selasar.id,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    selasar,
                },
            );
        }
    }

    static async searchSelasars(
        query,
        selasarFilter,
        facilityFilter,
        offset,
        limit,
    ) {
        try {
            return await models.FacilitySelasar.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...selasarFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.FacilityBuilding,
                        include: [
                            {
                                model: models.Campus,
                            },
                        ],
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }

    static async countSelasars(query, selasarFilter, facilityFilter) {
        try {
            return await models.FacilitySelasar.count({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    ],
                    ...selasarFilter,
                },
                include: [
                    {
                        model: models.Facility,
                        where: {
                            ...facilityFilter,
                        },
                    },
                    {
                        model: models.FacilityBuilding,
                        include: [
                            {
                                model: models.Campus,
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                },
            );
        }
    }
}

module.exports = FacilityRepository;
