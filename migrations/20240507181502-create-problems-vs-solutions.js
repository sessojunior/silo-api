"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("ProblemsVsSolutions", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			problemId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Problems",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			solutionId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Solutions",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("ProblemsVsSolutions");
	},
};
