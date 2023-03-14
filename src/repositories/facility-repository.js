const { models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class FacilityRepository {
    static async createFacility(facility) {
        try {
            return await models.Facility.create({
                pic_id: facility.pic_id,
                category: facility.category,
                electricity: facility.electricity,
                utility: facility.utility,
                price: facility.price,
                description: facility.description,
            });
        } catch (err) {
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                facility,
            });
        }
    }

    static async getFacility(id) {
        try {
            return (await models.Facility.findOne({
                where: {
                    id,
                },
            })).dataValues;
        } catch (err) {
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                id,
            });
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
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                id,
            });
        }
    }

    static async updateFacility(facility) {
        try {
            await models.Facility.update({
                pic_id: facility.pic_id,
                category: facility.category,
                electricity: facility.electricity,
                utility: facility.utility,
                price: facility.price,
                description: facility.description,
            }, {
                where: {
                    id: facility.id,
                },
            });
        } catch (err) {
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                facility,
            });
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
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                vehicle,
            });
        }
    }

    static async getVehicle(id) {
        try {
            return (await models.FacilityVehicle.findOne({
                where: {
                    id,
                },
            })).dataValues;
        } catch (err) {
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                id,
            });
        }
    }

    static async updateVehicle(vehicle) {
        try {
            await models.FacilityVehicle.update({
                campus_id: vehicle.campus_id,
                name: vehicle.name,
                type: vehicle.type,
                sim_category: vehicle.sim_category,
                license_number: vehicle.license_number,
                vehicle_capacity: vehicle.vehicle_capacity,
                image: vehicle.image,
                status_maintenance: vehicle.status_maintenance,
            }, {
                where: {
                    id: vehicle.id,
                },
            });
        } catch (err) {
            throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
                vehicle,
            });
        }
    }
}

module.exports = FacilityRepository;