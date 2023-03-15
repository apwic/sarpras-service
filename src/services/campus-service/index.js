const CampusRepository = require('../../repositories/campus-repository');

class CampusService {
    static async getCampuses() {
        const campus = await CampusRepository.getCampuses();

        return {
            message: 'Campus retrieved succesfully',
            data: campus,
        };
    }
}

module.exports = CampusService;