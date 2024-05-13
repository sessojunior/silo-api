// Allowed roles: admin
module.exports.admin = (req, res, next) => {
	if (!req.user.roles.includes("admin")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};

// Allowed roles: admin, editor
module.exports.editor = (req, res, next) => {
	if (!req.user.roles.includes("admin") && !req.user.roles.includes("editor")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};

// Allowed roles: admin, editor, viewer
module.exports.viewer = (req, res, next) => {
	if (!req.user.roles.includes("admin") && !req.user.roles.includes("editor") && !req.user.roles.includes("viewer")) {
		return res.status(403).send({ error: "Acesso negado." });
	}

	next();
};
