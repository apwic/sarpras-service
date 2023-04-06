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

        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

        Issue.belongsTo(models.User, {
            foreignKey: 'user_assigned_id',
            as: 'user_creator',
        });
        Issue.belongsTo(models.User, {
            foreignKey: 'user_creator_id',
            as: 'user_assigned',
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

        old_data: {
            type: DataTypes.TEXT,
        },

        new_data: {
            type: DataTypes.TEXT,
        },
    });

    return LoggingIssue;
};

module.exports = { IssueModel, LoggingIssueModel, ReviewIssueModel };
