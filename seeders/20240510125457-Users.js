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
		const salt = await bcrypt.genSalt(15);
		const password = await bcrypt.hash("123456", salt);
		const dataAtual = new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");
		const horaAtual = new Date().toLocaleTimeString("pt-BR", { hour12: false }).replace(/:/g, ":").replace(",", "");
		const dataHoraAtual = `${dataAtual} ${horaAtual}`;
		await queryInterface.bulkInsert(
			"Users",
			[
				{ name: "Mario", email: "mario@teste.com", password: password, roles: '["admin", "editor", "viewer"]', createdAt: dataHoraAtual, updatedAt: dataHoraAtual },
				{ name: "Lucas", email: "lucas@teste.com", password: password, roles: '["editor", "viewer"]', createdAt: dataHoraAtual, updatedAt: dataHoraAtual },
			],
			{}
		);
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
