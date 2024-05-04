const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Services = require("../models/services")(sequelize, Sequelize.DataTypes);
const bcrypt = require("bcryptjs");

// [GET] /services
// req.query: /services?page=1&limit_per_page=10
module.exports.getServices = async (req, res) => {
	console.log(`Url requisitada (getServices): ${req.url}`);

	let page = Math.abs(parseInt(req.query.page)) || 1;
	let limit_per_page = Math.abs(parseInt(req.query.limit_per_page)) || 10;

	// Page: 1 - 10000
	page = page <= 0 ? 1 : page;
	page = page > 10000 ? 10000 : page;

	// Limit per page: 1 - 1000
	limit_per_page = limit_per_page <= 0 ? 1 : limit_per_page;
	limit_per_page = limit_per_page > 1000 ? 1000 : limit_per_page;

	const offset = (page - 1) * limit_per_page;

	await Services.findAll({
		offset: offset,
		limit: limit_per_page,
		attributes: ["id", "name", "createdAt", "updatedAt"],
	})
		.then((data) => {
			res.status(200).json({
				page: page,
				limit_per_page: limit_per_page,
				total_pages: Math.ceil(data.length / limit_per_page),
				total_items: data.length,
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: "Sem resultados" });
		});
};

// [POST] /services
// req.body:
// {
// 	 "name": "BAM",
// }
module.exports.addService = async (req, res) => {
	console.log(`Url requisitada (addService): ${req.url}`);

	const name = req.body.name.trim();

	if (await Services.findOne({ where: { name: name } })) {
		return res.status(400).json({ error: "Já existe um serviço com este nome." });
	}

	await Services.create({
		name: name,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				name: data.name,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /services/:id
module.exports.getService = async (req, res) => {
	console.log(`Url requisitada (getService): ${req.url}`);

	const serviceId = parseInt(req.params.id);

	await Services.findByPk(serviceId)
		.then((data) => {
			res.status(200).json({
				id: data.id,
				name: data.name,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ error: "Não existe um serviço com este ID." });
		});
};

// [PUT] /services/:id
// req.body:
// {
// 	 "name": "BAM",
// }
module.exports.updateService = async (req, res) => {
	console.log(`Url requisitada (updateService): ${req.url}`);

	const serviceId = parseInt(req.params.id);

	const service = await Services.findByPk(serviceId);
	if (!service) {
		return res.status(400).json({ error: "Não existe um serviço com este ID." });
	}

	let serviceData = {};

	if (req.body.name !== undefined) {
		const name = req.body.name.trim();
		serviceData = {
			...serviceData,
			name: name,
		};
		if (await Services.findOne({ where: [{ id: { [Op.ne]: serviceId } }, { name: name }] })) {
			return res.status(400).json({ error: "Já existe um serviço com este nome." });
		}
	}

	await service
		.update({
			...serviceData,
		})
		.then((data) => {
			res.status(200).json({
				id: data.id,
				name: data.name,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [DELETE] /services/:id
module.exports.deleteService = async (req, res) => {
	console.log(`Url requisitada (deleteService): ${req.url}`);

	const serviceId = parseInt(req.params.id);

	const service = await Services.findByPk(serviceId);
	if (!service) {
		return res.status(400).json({ error: "Não existe um serviço com este ID." });
	}

	await service
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
