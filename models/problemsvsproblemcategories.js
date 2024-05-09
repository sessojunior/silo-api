"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ProblemsVsProblemCategories extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Problems, { foreignKey: "problemId" });
			this.hasMany(models.ProblemCategories, { foreignKey: "problemCategoryId" });
		}
	}
	ProblemsVsProblemCategories.init(
		{
			problemId: DataTypes.INTEGER,
			problemCategoryId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "ProblemsVsProblemCategories",
		}
	);
	return ProblemsVsProblemCategories;
};
