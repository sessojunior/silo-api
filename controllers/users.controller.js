const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Users = require("../models/users")(sequelize, Sequelize.DataTypes);
const bcrypt = require("bcryptjs");

// [GET] /users
// req.query: /users?page=1&limit=10
module.exports.getUsers = async (req, res) => {
	console.log(`Url requisitada (getUsers): ${req.url}`);

	const page = req.query.page || 1;
	const limit = req.query.limit || 10;

	const offset = (page - 1) * limit;

	await Users.findAll({
		offset: offset,
		limit: limit,
		attributes: ["id", "name", "email", "createdAt", "updatedAt"],
	})
		.then((data) => {
			res.status(200).json({
				page: page,
				count_pages: Math.ceil(data.length / limit),
				count_items: data.length,
				data: data,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [POST] /users
// req.body:
// {
// 	 "name": "Mario",
// 	 "email": "mario@test.com",
// 	 "password": "123456"
// }
module.exports.addUser = async (req, res) => {
	console.log(`Url requisitada (addUser): ${req.url}`);

	const name = req.body.name.trim();
	const email = req.body.email.trim().toLowerCase();
	const password = req.body.password;
	const password_hash = await bcrypt.hash(password, 8);

	if (await Users.findOne({ where: { email: email } })) {
		return res.status(400).json({ error: "Já existe um usuário com este e-mail." });
	}

	await Users.create({
		name: name,
		email: email,
		password_hash: password_hash,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				name: data.name,
				email: data.email,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
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
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ error: "Não existe um usuário com este ID." });
		});
};

// [PUT] /users/:id
// req.body:
// {
// 	 "name": "Mario",
// 	 "email": "mario@test.com",
// 	 "password": "123456"
// }
module.exports.updateUser = async (req, res) => {
	console.log(`Url requisitada (updateUser): ${req.url}`);

	const userId = parseInt(req.params.id);

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(400).json({ error: "Não existe um usuário com este ID." });
	}

	let userData = {};

	if (req.body.name !== undefined) {
		userData = {
			...userData,
			name: req.body.name.trim(),
		};
	}

	if (req.body.email !== undefined) {
		const email = req.body.email.trim().toLowerCase();
		userData = {
			...userData,
			email: email,
		};
		if (await Users.findOne({ where: [{ id: { [Op.ne]: userId } }, { email: email }] })) {
			return res.status(400).json({ error: "Já existe um usuário com este e-mail." });
		}
	}

	if (req.body.password !== undefined) {
		const password_hash = await bcrypt.hash(req.body.password, 8);
		userData = {
			...userData,
			password_hash: password_hash,
		};
	}

	await user
		.update({
			...userData,
		})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				name: data.name,
				email: data.email,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

module.exports.deleteUser = async (req, res) => {
	console.log(`Url requisitada (deleteUser): ${req.url}`);

	const userId = parseInt(req.params.id);

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(400).json({ error: "Não existe um usuário com este ID." });
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