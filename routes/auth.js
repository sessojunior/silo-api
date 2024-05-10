const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Routes: /api/auth
router.post("/", async (req, res) => {
	const email = req.body.email.trim().toLowerCase() || "";
	const password = req.body.password || "";

	// Dummy data test
	const users = [
		{
			id: 1,
			name: "Mario",
			email: "mario@teste.com",
			password: "$2b$08$dcnDWiXl3wbftoWmQ.5XyueLzpm.lIDAXW/pYa.T2tCcBb8Ld44Ny",
			roles: ["admin", "editor", "viewer"],
			createdAt: "2024-05-07 13:42:14.060 +00:00",
			updatedAt: "2024-05-07 13:42:14.060 +00:00",
		},
	];

	// Check email
	const user = users.find((user) => user.email === email);
	if (!user) {
		return res.status(400).json({ error: "E-mail não encontrado." });
	}

	// Check password
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) {
		return res.status(400).json({ error: "Senha inválida." });
	}

	// Token
	// const token = jwt.sign(
	// 	{
	// 		id: user.id,
	// 		roles: user.roles,
	// 	},
	// 	"jwtPrivateKey",
	// 	{ expiresIn: "15m" }
	// );
});

module.exports = router;
