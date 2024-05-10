const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Users = require("../models/users")(sequelize, Sequelize.DataTypes);
const Roles = require("../models/roles")(sequelize, Sequelize.DataTypes);
const UsesrVsRoles = require("../models/usersvsroles")(sequelize, Sequelize.DataTypes);

// [POST] /usersvsroles
// req.body:
// {
// 	 "userId": 1,
// 	 "roleId": 1
// }
module.exports.addUserVsRole = async (req, res) => {
	console.log(`Url requisitada (addUserVsRole): ${req.url}`);

	const userId = parseInt(req.body.userId) || 0;
	const roleId = parseInt(req.body.roleId) || 0;

	// Required fields
	if (userId <= 0 || roleId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o usuário e a função do usuário." });
	}

	if (await UsesrVsRoles.findOne({ where: { [Op.and]: [{ userId: userId }, { roleId: roleId }] } })) {
		return res.status(400).json({ error: "Já existe um relacionamento entre este usuário e esta função do usuário." });
	}

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).json({ error: "Não existe um usuário com este ID." });
	}

	const role = await Roles.findByPk(roleId);
	if (!role) {
		return res.status(404).json({ error: "Não existe uma função do usuário com este ID." });
	}

	await UsesrVsRoles.create({
		userId: userId,
		roleId: roleId,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				userId: data.userId,
				roleId: data.roleId,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /usersvsroles
// req.query: /usersvsroles?userId=1
module.exports.getUserVsRole = async (req, res) => {
	console.log(`Url requisitada (getUserVsRole): ${req.url}`);

	const userId = parseInt(req.query.userId) || 0;

	// Required fields
	if (userId <= 0 && roleId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o usuário ou a função do usuário." });
	}

	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).json({ error: "Não existe um usuário com este ID." });
	}

	await UsesrVsRoles.findAll({ where: { userId: userId } })
		.then((data) => {
			res.status(200).json({
				data: data,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(404).json({ error: "Não existe uma função do usuário para este usuário." });
		});
};

// [DELETE] /usersvsroles
// req.query: /usersvsroles?userId=1&roleId=1
module.exports.deleteUserVsRole = async (req, res) => {
	console.log(`Url requisitada (deleteUserVsRole): ${req.url}`);

	const userId = parseInt(req.query.userId) || 0;
	const roleId = parseInt(req.query.roleId) || 0;

	// Required fields
	if (userId <= 0 || roleId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o usuário e a função do usuário." });
	}

	if (!(await UsesrVsRoles.findOne({ where: { [Op.and]: [{ userId: userId }, { roleId: roleId }] } }))) {
		return res.status(400).json({
			error: "Não existe um relacionamento entre este usuário e esta função do usuário.",
			details: { userId: userId, roleId: roleId },
		});
	}

	await UsesrVsRoles.destroy({ where: { [Op.and]: [{ userId: userId }, { roleId: roleId }] } })
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			return res.status(400).json({
				error: "Não existe um relacionamento entre este usuário e esta função do usuário.",
				details: { userId: userId, roleId: roleId },
			});
		});
};
