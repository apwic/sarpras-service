const getUsersModel = (sequelize, { DataTypes }) => {
  const Users = sequelize.define('users',  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    role: {
      type: DataTypes.ENUM("Basic", "Admin", "Staff"),
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    nim_nip: {
      type: DataTypes.STRING,
      allowNull: false
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false
    },

    no_telp: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Users;
}

module.exports = getUsersModel;