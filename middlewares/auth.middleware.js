const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
	// Authorization: Bearer <token>
	const token = req.headers.authorization !== undefined && req.headers.authorization.split(" ")[0].toLowerCase() === "bearer" ? req.headers.authorization.split(" ")[1] : false;
	if (!token) {
		return res.status(401).json({ error: "Acesso negado. Nenhum token foi fornecido." });
	}

	try {
		const decoded = jwt.verify(token, "jwtPrivateKey");
		req.user = decoded;
	} catch (error) {
		return res.status(401).json({ error: "Token inválido ou expirado." });
	}

	return next();
};
