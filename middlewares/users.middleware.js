const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
	email: yup.string().trim().email().required(),
	password: yup.string().min(6).max(30).required(),
};

// Add User
module.exports.checkAddUser = async (req, res, next) => {
	console.log(`Middleware (checkAddUser)`);

	if (!(await schema.name.isValid(req.body.name))) {
		return res.status(400).json({ error: "Nome é necessário." });
	}
	if (!(await schema.email.isValid(req.body.email))) {
		return res.status(400).json({ error: "E-mail é necessário e precisa ser válido." });
	}
	if (!(await schema.password.isValid(req.body.password))) {
		return res.status(400).json({ error: "Senha é necessário e precisa ter de 6 a 30 caracteres." });
	}

	return next();
};

module.exports.checkUpdateUser = async (req, res, next) => {
	console.log(`Middleware (checkUpdateUser)`);

	console.log(req.body);

	if (req.body.name !== undefined) {
		if (!(await schema.name.isValid(req.body.name))) {
			return res.status(400).json({ error: "Nome é necessário." });
		}
	}
	if (req.body.email !== undefined) {
		if (!(await schema.email.isValid(req.body.email))) {
			return res.status(400).json({ error: "E-mail é necessário e precisa ser válido." });
		}
	}
	if (req.body.password !== undefined) {
		if (!(await schema.password.isValid(req.body.password))) {
			return res.status(400).json({ error: "Senha é necessário e precisa ter de 6 a 30 caracteres." });
		}
	}

	return next();
};
