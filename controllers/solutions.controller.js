const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Solutions = require("../models/solutions")(sequelize, Sequelize.DataTypes);

// [GET] /solutions
// req.query: /solutions?page=1&limit_per_page=10&order_by=id&order_sort=ASC&filter=
module.exports.getSolutions = async (req, res) => {
	console.log(`Url requisitada (getSolutions): ${req.url}`);

	// Page
	let page = Math.abs(parseInt(req.query.page)) || 1;
	let limit_per_page = Math.abs(parseInt(req.query.limit_per_page)) || 10;

	// Page: 1 - 10000
	page = page <= 0 ? 1 : page;
	page = page > 10000 ? 10000 : page;

	// Limit per page: 1 - 1000
	limit_per_page = limit_per_page <= 0 ? 1 : limit_per_page;
	limit_per_page = limit_per_page > 1000 ? 1000 : limit_per_page;

	// Columns
	const columns = ["id", "description", "createdAt", "updatedAt"];

	// Order by
	const order_by = req.query.order_by !== undefined && columns.includes(req.query.order_by) ? req.query.order_by : "id";
	const order_sort = req.query.order_sort !== undefined && req.query.order_sort.toUpperCase() == "DESC" ? "DESC" : "ASC";

	const offset = (page - 1) * limit_per_page;
	const limit = limit_per_page;

	// Query
	const filter = req.query.filter !== undefined && req.query.filter.trim().length > 0 ? req.query.filter.trim() : "";
	let where = {};
	if (filter.length > 0) {
		where = {
			where: {
				description: { [Op.like]: "%" + filter + "%" },
			},
		};
	}

	const total_items = await Solutions.count();

	await Solutions.findAll({
		...where,
		offset: offset,
		limit: limit,
		attributes: columns,
		order: [[order_by, order_sort]],
	})
		.then((data) => {
			res.status(200).json({
				page: page,
				limit_per_page: limit_per_page,
				total_pages: Math.ceil(total_items / limit_per_page),
				total_items: total_items,
				order_by: order_by,
				order_sort: order_sort,
				filter: filter,
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
};

// [POST] /solutions
// req.body:
// {
// 	 "description": "Acesso ao disco",
// }
module.exports.addSolution = async (req, res) => {
	console.log(`Url requisitada (addSolution): ${req.url}`);

	const description = req.body.description.trim();

	if (await Solutions.findOne({ where: { description: description } })) {
		return res.status(400).json({ error: "Já existe uma solução com esta descrição." });
	}

	await Solutions.create({
		description: description,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /solutions/:id
module.exports.getSolution = async (req, res) => {
	console.log(`Url requisitada (getSolution): ${req.url}`);

	const solutionId = parseInt(req.params.id);

	await Solutions.findByPk(solutionId)
		.then((data) => {
			res.status(200).json({
				id: data.id,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ error: "Não existe uma solução com este ID." });
		});
};

// [PUT] /solutions/:id
// req.body:
// {
// 	 "description": "Acesso negado",
// }
module.exports.updateSolution = async (req, res) => {
	console.log(`Url requisitada (updateSolution): ${req.url}`);

	const solutionId = parseInt(req.params.id);
	const description = req.body.description.trim();

	const solution = await Solutions.findByPk(solutionId);
	if (!solution) {
		return res.status(404).json({ error: "Não existe uma solução com este ID." });
	}

	if (await Solutions.findOne({ where: [{ id: { [Op.ne]: solutionId } }, { description: description }] })) {
		return res.status(400).json({ error: "Já existe uma solução com esta descrição." });
	}

	await solution
		.update({
			solutionId: solutionId,
			description: description,
		})
		.then((data) => {
			res.status(200).json({
				id: data.id,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [DELETE] /solutions/:id
module.exports.deleteSolution = async (req, res) => {
	console.log(`Url requisitada (deleteSolution): ${req.url}`);

	const solutionId = parseInt(req.params.id);

	const solution = await Solutions.findByPk(solutionId);
	if (!solution) {
		return res.status(404).json({ error: "Não existe uma solução com este ID." });
	}

	await solution
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
