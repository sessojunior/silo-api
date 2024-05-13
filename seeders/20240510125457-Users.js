"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("Users", [{ name: "Mario", email: "mario@teste.com", password: "viewe$2a$08$5YiRHW/o6.aW.ErN0lBx.uIA1zIl1cQ.S0xOKdlRlsipiMOzAAJFKr", roles: '["admin", "editor", "viewer"]', createdAt: "2024-05-07 13:42:14.060 +00:00", updatedAt: "2024-05-07 13:42:14.060 +00:00" }], {});
		await queryInterface.bulkInsert("Users", [{ name: "Lucas", email: "lucas@teste.com", password: "viewe$2a$08$5YiRHW/o6.aW.ErN0lBx.uIA1zIl1cQ.S0xOKdlRlsipiMOzAAJFKr", roles: '["editor", "viewer"]', createdAt: "2024-05-07 13:42:14.060 +00:00", updatedAt: "2024-05-07 13:42:14.060 +00:00" }], {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Users", null, {});
	},
};
