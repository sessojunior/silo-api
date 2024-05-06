"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn("Users", "password_hash", "passwordHash");
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn("Users", "passwordHash", "password_hash");
	},
};
