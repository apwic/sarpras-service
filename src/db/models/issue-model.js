const IssueModel = (sequelize, { DataTypes }) => {
    const Issue = sequelize.define('issue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_creator_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        user_assigned_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        category: {
            type: DataTypes.ENUM('SANITATION', 'DEFECT', 'SAFETY', 'LOSS'),
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED'),
            allowNull: false,
        },

        image: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },

        description: {
            type: DataTypes.STRING,
        },
    });

    Issue.associate = (models) => {
        Issue.hasOne(models.ReviewIssue, {
            foreignKey: 'issue_id',
            onDelete: 'CASCADE',
        });
        Issue.hasMany(models.LoggingIssue, {
            foreignKey: 'issue_id',
            onDelete: 'CASCADE',
        });
    };

    return Issue;
};

const ReviewIssueModel = (sequelize, { DataTypes }) => {
    const ReviewIssue = sequelize.define('review_issue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        issue_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'issue',
                key: 'id',
            },
        },

        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5,
            },
        },

        description: {
            type: DataTypes.STRING,
        },
    });

    return ReviewIssue;
};

const LoggingIssueModel = (sequelize, { DataTypes }) => {
    const LoggingIssue = sequelize.define('logging_issue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        issue_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'issue',
                key: 'id',
            },
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return LoggingIssue;
};

module.exports = { IssueModel, LoggingIssueModel, ReviewIssueModel };
