"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ProblemsVsSolutions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Problems, { foreignKey: "problemId" });
			this.hasMany(models.Solutions, { foreignKey: "solutionId" });
		}
	}
	ProblemsVsSolutions.init(
		{
			problemId: DataTypes.INTEGER,
			solutionId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "ProblemsVsSolutions",
		}
	);
	return ProblemsVsSolutions;
};
