const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Users = require("../models/users")(sequelize, Sequelize.DataTypes);
const bcrypt = require("bcrypt");

// Format date
function formatDate(date) {
	const dataAtual = date.toLocaleDateString("pt-BR").split("/").reverse().join("-");
	const horaAtual = date.toLocaleTimeString("pt-BR", { hour12: false }).replace(/:/g, ":").replace(",", "");
	return `${dataAtual} ${horaAtual}`;
}

// [GET] /users
// req.query: /users?page=1&limit_per_page=10&order_by=id&order_sort=ASC&filter=Mario
module.exports.getUsers = async (req, res) => {
	console.log(`Url requisitada (getUsers): ${req.url}`);

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
	const columns = ["id", "name", "email", "roles", "createdAt", "updatedAt"];

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
				[Op.or]: [{ name: { [Op.like]: "%" + filter + "%" } }, { email: { [Op.like]: "%" + filter + "%" } }],
			},
		};
	}

	const total_items = await Users.count();

	await Users.findAll({
		...where,
		offset: offset,
		limit: limit,
		attributes: columns,
		order: [[order_by, order_sort]],
	})
		.then((data) => {
			const customData = data.map((item) => {
				return {
					id: item.id,
					name: item.name,
					email: item.email,
					roles: JSON.parse(item.roles),
					createdAt: formatDate(item.createdAt),
					updatedAt: formatDate(item.updatedAt),
				};
			});
			res.status(200).json({
				page: page,
				limit_per_page: limit_per_page,
				total_pages: Math.ceil(total_items / limit_per_page),
				total_items: total_items,
				order_by: order_by,
				order_sort: order_sort,
				data: customData,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
};

// [POST] /users
// req.body:
// {
// 	 "name": "Mario",
// 	 "email": "mario@test.com",
// 	 "password": "123456",
// 	 "roles": ["admin", "editor", "viewer"]
// }
module.exports.addUser = async (req, res) => {
	console.log(`Url requisitada (addUser): ${req.url}`);

	const name = req.body.name.trim();
	const email = req.body.email.trim().toLowerCase();
	const salt = await bcrypt.genSalt(15);
	const password = await bcrypt.hash(req.body.password, salt);
	const roles = JSON.stringify(req.body.roles);

	if (await Users.findOne({ where: { email: email } })) {
		return res.status(400).json({ error: "Já existe um usuário com este e-mail." });
	}

	await Users.create({
		name: name,
		email: email,
		password: password,
		roles: roles,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				name: data.name,
				email: data.email,
				roles: JSON.parse(data.roles),
				createdAt: formatDate(data.createdAt),
				updatedAt: formatDate(data.updatedAt),
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /users/:id
module.exports.getUser = async (req, res) => {
	console.log(`Url requisitada (getUser): ${req.url}`);

	const userId = parseInt(req.params.id);

	await Users.findByPk(userId)
		.then((data) => {
			res.status(200).json({
				id: data.id,
				name: data.name,
				email: data.email,
				roles: JSON.parse(data.roles),
				createdAt: formatDate(data.createdAt),
				updatedAt: formatDate(data.updatedAt),
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ error: "Não existe um usuário com este ID." });
		});
};

// [PUT] /users/:id
// req.body:
// {
// 	 "name": "Mario",
// 	 "email": "mario@test.com",
// 	 "password": "123456",
// 	 "roles": ["editor", "viewer"]
// }
module.exports.updateUser = async (req, res) => {
	console.log(`Url requisitada (updateUser): ${req.url}`);

	const userId = parseInt(req.params.id);
	const name = req.body.name.trim();
	const email = req.body.email.trim().toLowerCase();
	const roles = JSON.stringify(req.body.roles);

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).json({ error: "Não existe um usuário com este ID." });
	}

	if (await Users.findOne({ where: [{ id: { [Op.ne]: userId } }, { email: email }] })) {
		return res.status(400).json({ error: "Já existe um usuário com este e-mail." });
	}

	let userData = {
		name: name,
		email: email,
		roles: roles,
	};

	if (req.body.password !== undefined) {
		const salt = await bcrypt.genSalt(15);
		const password = await bcrypt.hash(req.body.password, salt);
		userData = {
			...userData,
			password: password,
		};
	}

	await user
		.update({
			...userData,
		})
		.then((data) => {
			res.status(200).json({
				id: data.id,
				name: data.name,
				email: data.email,
				roles: JSON.parse(data.roles),
				createdAt: formatDate(data.createdAt),
				updatedAt: formatDate(data.updatedAt),
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [DELETE] /users/:id
module.exports.deleteUser = async (req, res) => {
	console.log(`Url requisitada (deleteUser): ${req.url}`);

	const userId = parseInt(req.params.id);

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).json({ error: "Não existe um usuário com este ID." });
	}

	await user
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
