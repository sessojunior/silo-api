module.exports.admin = (req, res, next) => {
	if (!req.user.roles.includes("admin")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};

module.exports.editor = (req, res, next) => {
	if (!req.user.roles.includes("editor")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};

module.exports.viewer = (req, res, next) => {
	if (!req.user.roles.includes("viewer")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};
