const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Tasks = require("../models/tasks")(sequelize, Sequelize.DataTypes);
const Problems = require("../models/problems")(sequelize, Sequelize.DataTypes);

// [GET] /problems
// req.query: /problems?page=1&limit_per_page=10&order_by=id&order_sort=ASC&taskId=1&filter=
module.exports.getProblems = async (req, res) => {
	console.log(`Url requisitada (getProblems): ${req.url}`);

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
	const columns = ["id", "taskId", "title", "description", "createdAt", "updatedAt"];

	// Order by
	const order_by = req.query.order_by !== undefined && columns.includes(req.query.order_by) ? req.query.order_by : "id";
	const order_sort = req.query.order_sort !== undefined && req.query.order_sort.toUpperCase() == "DESC" ? "DESC" : "ASC";

	const offset = (page - 1) * limit_per_page;
	const limit = limit_per_page;

	// Foreign Key (req.query)
	const taskId = req.query.taskId !== undefined && parseInt(req.query.taskId) > 0 ? parseInt(req.query.taskId) : 0;

	if (taskId > 0 && !(await Tasks.findOne({ where: { id: taskId } }))) {
		return res.status(400).json({ error: "Não existe uma tarefa com este ID." });
	}

	// Query
	const filter = req.query.filter !== undefined && req.query.filter.trim().length > 0 ? req.query.filter.trim() : "";
	let where = {};
	if (filter.length > 0) {
		if (taskId > 0) {
			where = {
				where: {
					[Op.and]: [{ taskId: taskId }, { description: { [Op.like]: "%" + filter + "%" } }],
				},
			};
		} else {
			where = {
				where: {
					description: { [Op.like]: "%" + filter + "%" },
				},
			};
		}
	} else if (taskId > 0) {
		where = {
			where: {
				taskId: taskId,
			},
		};
	}

	const total_items = await Problems.count();

	await Problems.findAll({
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
				taskId: taskId,
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
};

// [POST] /problems
// req.body:
// {
// 	 "taskId": 1,
// 	 "description": "Acesso negado"
// }
module.exports.addProblem = async (req, res) => {
	console.log(`Url requisitada (addProblem): ${req.url}`);

	const title = req.body.title.trim();
	const description = req.body.description.trim();

	if (await Problems.findOne({ where: { title: title } })) {
		return res.status(400).json({ error: "Já existe um problema com este título." });
	}

	// Foreign Key (req.body)
	const taskId = req.body.taskId !== undefined && parseInt(req.body.taskId) > 0 ? parseInt(req.body.taskId) : 0;

	if (taskId > 0 && !(await Tasks.findOne({ where: { id: taskId } }))) {
		return res.status(400).json({ error: "Não existe uma tarefa com este ID." });
	}

	await Problems.create({
		taskId: taskId,
		title: title,
		description: description,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				taskId: data.taskId,
				title: data.title,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /problems/:id
module.exports.getProblem = async (req, res) => {
	console.log(`Url requisitada (getProblem): ${req.url}`);

	const problemId = parseInt(req.params.id);

	await Problems.findByPk(problemId)
		.then((data) => {
			res.status(200).json({
				id: data.id,
				taskId: data.taskId,
				title: data.title,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ error: "Não existe um problema com este ID." });
		});
};

// [PUT] /problems/:id
// req.body:
// {
// 	 "taskId": 2,
// 	 "title": "Disco cheio"
// 	 "description": "Volume do disco está cheio"
// }
module.exports.updateProblem = async (req, res) => {
	console.log(`Url requisitada (updateProblem): ${req.url}`);

	const problemId = parseInt(req.params.id);
	const title = req.body.title.trim();
	const description = req.body.description.trim();

	const problem = await Problems.findByPk(problemId);
	if (!problem) {
		return res.status(404).json({ error: "Não existe um problema com este ID." });
	}

	// Foreign Key
	const taskId = req.body.taskId !== undefined && parseInt(req.body.taskId) > 0 ? parseInt(req.body.taskId) : 0;

	if (taskId > 0 && !(await Problems.findOne({ where: { taskId: taskId } }))) {
		return res.status(400).json({ error: "Não existe uma tarefa com este ID." });
	}

	if (await Problems.findOne({ where: [{ id: { [Op.ne]: problemId } }, { title: title }] })) {
		return res.status(400).json({ error: "Já existe um problema com este título." });
	}

	await problem
		.update({
			taskId: taskId,
			title: title,
			description: description,
		})
		.then((data) => {
			res.status(200).json({
				id: data.id,
				taskId: data.taskId,
				title: data.title,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [DELETE] /problems/:id
module.exports.deleteProblem = async (req, res) => {
	console.log(`Url requisitada (deleteProblem): ${req.url}`);

	const problemId = parseInt(req.params.id);

	const problem = await Problems.findByPk(problemId);
	if (!problem) {
		return res.status(404).json({ error: "Não existe um problema com este ID." });
	}

	await problem
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
