const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token) {
		return res.status(401).json({ error: "Acesso negado. Nenhum token foi fornecido." });
	}

	try {
		const decoded = jwt.verify(token, "jwtPrivateKey");
		req.user = decoded;
	} catch (error) {
		return res.status(401).json({ error: "Token expirado." });
	}

	return next();
};
