const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const ProblemCategories = require("../models/problemcategories")(sequelize, Sequelize.DataTypes);

// [GET] /problemcategories
// req.query: /problemcategories?page=1&limit_per_page=10&order_by=id&order_sort=ASC&filter=
module.exports.getProblemCategories = async (req, res) => {
	console.log(`Url requisitada (getProblemCategories): ${req.url}`);

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
	const columns = ["id", "name", "createdAt", "updatedAt"];

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
				name: { [Op.like]: "%" + filter + "%" },
			},
		};
	}

	const total_items = await ProblemCategories.count();

	await ProblemCategories.findAll({
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

// [POST] /problemcategories
// req.body:
// {
// 	 "name": "Acesso ao disco",
// }
module.exports.addProblemCategory = async (req, res) => {
	console.log(`Url requisitada (addProblemCategory): ${req.url}`);

	const name = req.body.name.trim();

	if (await ProblemCategories.findOne({ where: { name: name } })) {
		return res.status(400).json({ error: "Já existe uma categoria de problemas com este nome." });
	}

	await ProblemCategories.create({
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

// [GET] /problemcategories/:id
module.exports.getProblemCategory = async (req, res) => {
	console.log(`Url requisitada (getProblemCategory): ${req.url}`);

	const problemCategoryId = parseInt(req.params.id);

	await ProblemCategories.findByPk(problemCategoryId)
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
			res.status(404).json({ error: "Não existe uma categoria de problemas com este ID." });
		});
};

// [PUT] /problemcategories/:id
// req.body:
// {
// 	 "name": "Acesso negado",
// }
module.exports.updateProblemCategory = async (req, res) => {
	console.log(`Url requisitada (updateProblemCategory): ${req.url}`);

	const problemCategoryId = parseInt(req.params.id);
	const name = req.body.name.trim();

	const problemCategory = await ProblemCategories.findByPk(problemCategoryId);
	if (!problemCategory) {
		return res.status(404).json({ error: "Não existe uma categoria de problemas com este ID." });
	}

	if (await ProblemCategories.findOne({ where: [{ id: { [Op.ne]: problemCategoryId } }, { name: name }] })) {
		return res.status(400).json({ error: "Já existe uma categoria de problemas com este nome." });
	}

	await problemCategory
		.update({
			problemCategoryId: problemCategoryId,
			name: name,
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

// [DELETE] /problemcategories/:id
module.exports.deleteProblemCategory = async (req, res) => {
	console.log(`Url requisitada (deleteProblemCategory): ${req.url}`);

	const problemCategoryId = parseInt(req.params.id);

	const problemCategory = await ProblemCategories.findByPk(problemCategoryId);
	if (!problemCategory) {
		return res.status(404).json({ error: "Não existe uma categoria de problemas com este ID." });
	}

	await problemCategory
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
