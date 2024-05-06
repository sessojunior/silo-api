"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Tasks extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasOne(models.Service, { foreignKey: "serviceId" });
		}
	}
	Tasks.init(
		{
			serviceId: DataTypes.INTEGER,
			name: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Tasks",
		}
	);
	return Tasks;
};
