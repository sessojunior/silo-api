"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Problems extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasOne(models.Tasks, { foreignKey: "taskId" });
		}
	}
	Problems.init(
		{
			taskId: DataTypes.INTEGER,
			title: DataTypes.STRING,
			description: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Problems",
		}
	);
	return Problems;
};
