const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Users = require("../models/users")(sequelize, Sequelize.DataTypes);

// Routes: /api/auth
router.post(["/", "/login"], async (req, res) => {
	const email = req.body.email.trim() || "";
	const password = req.body.password || "";

	const user = await Users.findOne({ where: { email: email } });
	if (!user) {
		return res.status(404).json({ error: "Não existe um usuário com este e-mail." });
	}

	// Check password
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) {
		return res.status(400).json({ error: "Senha inválida." });
	}

	// Token
	// Authorization: Bearer <token>
	const token = jwt.sign(
		{
			id: user.id,
			roles: user.roles,
		},
		"jwtPrivateKey",
		{ expiresIn: "15m" }
	);
	if (!token) {
		return res.status(400).json({ error: "Erro ao obter o token." });
	}

	return res.status(200).json({ token: token, roles: JSON.parse(user.roles) });
});

module.exports = router;
