"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class UsersVsRoles extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Users, { foreignKey: "userId" });
			this.hasMany(models.Roles, { foreignKey: "roleId" });
		}
	}
	UsersVsRoles.init(
		{
			userId: DataTypes.INTEGER,
			roleId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "UsersVsRoles",
		}
	);
	return UsersVsRoles;
};
