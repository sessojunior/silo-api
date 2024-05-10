const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Roles = require("../models/roles")(sequelize, Sequelize.DataTypes);

// [GET] /roles
// req.query: /roles
module.exports.getRoles = async (req, res) => {
	console.log(`Url requisitada (getRoles): ${req.url}`);

	await Roles.findAll()
		.then((data) => {
			res.status(200).json({
				data: data,
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
};

// [POST] /roles
// req.body:
// {
// 	 "name": "admin",
// }
module.exports.addRole = async (req, res) => {
	console.log(`Url requisitada (addRole): ${req.url}`);

	const name = req.body.name.trim();

	if (await Roles.findOne({ where: { name: name } })) {
		return res.status(400).json({ error: "Já existe uma função de usuário com este nome." });
	}

	await Roles.create({
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

// [PUT] /roles/:id
// req.body:
// {
// 	 "name": "viewer",
// }
module.exports.updateRole = async (req, res) => {
	console.log(`Url requisitada (updateRole): ${req.url}`);

	const roleId = parseInt(req.params.id);
	const name = req.body.name.trim();

	const role = await Roles.findByPk(roleId);
	if (!role) {
		return res.status(404).json({ error: "Não existe uma função de usuário com este ID." });
	}

	if (await Roles.findOne({ where: [{ id: { [Op.ne]: roleId } }, { name: name }] })) {
		return res.status(400).json({ error: "Já existe uma função de usuário com este nome." });
	}

	await role
		.update({
			roleId: roleId,
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

// [DELETE] /roles/:id
module.exports.deleteRole = async (req, res) => {
	console.log(`Url requisitada (deleteRole): ${req.url}`);

	const roleId = parseInt(req.params.id);

	const role = await Roles.findByPk(roleId);
	if (!role) {
		return res.status(404).json({ error: "Não existe uma função de usuário com este ID." });
	}

	await role
		.destroy()
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
