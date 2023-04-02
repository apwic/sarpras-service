const issueStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELED: 'CANCELED',
};

const issueCategory = {
    SANITATION: 'SANITATION',
    DEFECT: 'DEFECT',
    SAFETY: 'SAFETY',
    LOSS: 'LOSS',
};

const issueStaffRoles = [
    'SANITATION_STAFF',
    'DEFECT_STAFF',
    'SAFETY_STAFF',
    'LOSS_STAFF',
];

module.exports = {
    issueStatus,
    issueCategory,
    issueStaffRoles,
};
