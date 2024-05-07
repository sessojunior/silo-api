const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Services = require("../models/services")(sequelize, Sequelize.DataTypes);
const Tasks = require("../models/tasks")(sequelize, Sequelize.DataTypes);

// [GET] /tasks
// req.query: /tasks?page=1&limit_per_page=10&order_by=id&order_sort=ASC&serviceId=1&filter=pos
module.exports.getTasks = async (req, res) => {
	console.log(`Url requisitada (getTasks): ${req.url}`);

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
	const columns = ["id", "serviceId", "name", "description", "createdAt", "updatedAt"];

	// Order by
	const order_by = req.query.order_by !== undefined && columns.includes(req.query.order_by) ? req.query.order_by : "id";
	const order_sort = req.query.order_sort !== undefined && req.query.order_sort.toUpperCase() == "DESC" ? "DESC" : "ASC";

	const offset = (page - 1) * limit_per_page;
	const limit = limit_per_page;

	// Foreign Key (req.query)
	const serviceId = req.query.serviceId !== undefined && parseInt(req.query.serviceId) > 0 ? parseInt(req.query.serviceId) : 0;

	if (serviceId > 0 && !(await Services.findOne({ where: { id: serviceId } }))) {
		return res.status(400).json({ error: "Não existe um serviço com este ID." });
	}

	// Query
	const filter = req.query.filter !== undefined && req.query.filter.trim().length > 0 ? req.query.filter.trim() : "";
	let where = {};
	if (filter.length > 0) {
		if (serviceId > 0) {
			where = {
				where: {
					[Op.and]: [{ serviceId: serviceId }, { name: { [Op.like]: "%" + filter + "%" } }],
				},
			};
		} else {
			where = {
				where: {
					name: { [Op.like]: "%" + filter + "%" },
				},
			};
		}
	} else if (serviceId > 0) {
		where = {
			where: {
				serviceId: serviceId,
			},
		};
	}

	const total_items = await Tasks.count();

	await Tasks.findAll({
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
				serviceId: serviceId,
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
};

// [POST] /tasks
// req.body:
// {
// 	 "serviceId": 1,
// 	 "name": "pos",
// 	 "description": "Pós da tarefa"
// }
module.exports.addTask = async (req, res) => {
	console.log(`Url requisitada (addTask): ${req.url}`);

	const name = req.body.name.trim();
	const description = req.body.description.trim();

	if (await Tasks.findOne({ where: { name: name } })) {
		return res.status(400).json({ error: "Já existe um tarefa com este nome." });
	}

	// Foreign Key (req.body)
	const serviceId = req.body.serviceId !== undefined && parseInt(req.body.serviceId) > 0 ? parseInt(req.body.serviceId) : 0;

	if (serviceId > 0 && !(await Services.findOne({ where: { id: serviceId } }))) {
		return res.status(400).json({ error: "Não existe um serviço com este ID." });
	}

	await Tasks.create({
		serviceId: serviceId,
		name: name,
		description: description,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				serviceId: data.serviceId,
				name: data.name,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /tasks/:id
module.exports.getTask = async (req, res) => {
	console.log(`Url requisitada (getTask): ${req.url}`);

	const taskId = parseInt(req.params.id);

	await Tasks.findByPk(taskId)
		.then((data) => {
			res.status(200).json({
				id: data.id,
				serviceId: data.serviceId,
				name: data.name,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ error: "Não existe uma tarefa com este ID." });
		});
};

// [PUT] /tasks/:id
// req.body:
// {
// 	 "serviceId": 2,
// 	 "name": "runPos",
// 	 "description": "Rodando o pós da tarefa"
// }
module.exports.updateTask = async (req, res) => {
	console.log(`Url requisitada (updateTask): ${req.url}`);

	const taskId = parseInt(req.params.id);
	const name = req.body.name.trim();
	const description = req.body.description.trim();

	const task = await Tasks.findByPk(taskId);
	if (!task) {
		return res.status(404).json({ error: "Não existe uma tarefa com este ID." });
	}

	// Foreign Key
	const serviceId = req.body.serviceId !== undefined && parseInt(req.body.serviceId) > 0 ? parseInt(req.body.serviceId) : 0;

	if (serviceId > 0 && !(await Tasks.findOne({ where: { serviceId: serviceId } }))) {
		return res.status(400).json({ error: "Não existe um serviço com este ID." });
	}

	if (await Tasks.findOne({ where: [{ id: { [Op.ne]: taskId } }, { name: name }] })) {
		return res.status(400).json({ error: "Já existe uma tarefa com este nome." });
	}

	await task
		.update({
			serviceId: serviceId,
			name: name,
			description: description,
		})
		.then((data) => {
			res.status(200).json({
				id: data.id,
				name: data.name,
				description: data.description,
				serviceId: data.serviceId,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [DELETE] /tasks/:id
module.exports.deleteTask = async (req, res) => {
	console.log(`Url requisitada (deleteTask): ${req.url}`);

	const taskId = parseInt(req.params.id);

	const task = await Tasks.findByPk(taskId);
	if (!task) {
		return res.status(404).json({ error: "Não existe uma tarefa com este ID." });
	}

	await task
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
