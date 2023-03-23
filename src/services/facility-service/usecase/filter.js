const CampusRepository = require('../../../repositories/campus-repository');
const FacilityRepository = require('../../../repositories/facility-repository');
const { catchThrows, isPromiseError } = require('../../../utils/promise');
const { vehicleType, simCategory } = require('../../../db/enums');

class FilterUsecase {
    static async __getSIMCategory() {
        return simCategory.map((category) => {
            return {
                id: category,
                name: category,
            };
        });
    }

    static async __getVehicleType() {
        return vehicleType.map((type) => {
            return {
                id: type,
                name: type,
            };
        });
    }

    static async __getBuildingList() {
        const buildingList = await FacilityRepository.getBuildings();

        const filteredBuildingList = buildingList.map((building) => {
            return {
                id: building.id,
                name: building.name,
            };
        });

        return filteredBuildingList;
    }

    static async __getCampusList() {
        const campusList = await CampusRepository.getCampuses();

        const filteredCampusList = campusList.map((campus) => {
            return {
                id: campus.id,
                name: campus.name,
            };
        });

        return filteredCampusList;
    }

    static async getFilter() {
        const filterPromise = [
            catchThrows(this.__getSIMCategory()),
            catchThrows(this.__getVehicleType()),
            catchThrows(this.__getBuildingList()),
            catchThrows(this.__getCampusList()),
        ];

        const filterList = await Promise.all(filterPromise);

        const [simCategory, vehicleType, buildingList, campusList] =
            filterList.map((filter) => {
                if (isPromiseError(filter)) {
                    return [];
                }

                return filter;
            });

        return {
            sim_category: simCategory,
            vehicle_type: vehicleType,
            building_list: buildingList,
            campus_list: campusList,
        };
    }
}

module.exports = FilterUsecase;
