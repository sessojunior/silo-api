const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
	email: yup.string().trim().email().required(),
	password: yup.string().min(6).max(30).required(),
	roles: yup.array().min(1).required(),
};

const validRoles = ["admin", "editor", "viewer"];
const checkRoles = (arr, target) => target.every((item) => arr.includes(item));

// Add User
module.exports.checkAddUser = async (req, res, next) => {
	console.log(`Middleware (checkAddUser)`);

	const { name, email, password, roles } = req.body;
	let fields = [];

	// Check fields
	if (name === undefined || !(await schema.name.isValid(name))) {
		fields.push("name");
	}
	if (email === undefined || !(await schema.email.isValid(email))) {
		fields.push("email");
	}
	if (password === undefined || !(await schema.password.isValid(password))) {
		fields.push("password");
	}
	if (roles === undefined || !(await schema.roles.isValid(roles)) || !checkRoles(validRoles, roles)) {
		fields.push("roles");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};

module.exports.checkUpdateUser = async (req, res, next) => {
	console.log(`Middleware (checkUpdateUser)`);

	const { name, email, password, roles } = req.body;
	let fields = [];

	// Required fields
	if (name === undefined || email === undefined) {
		return res.status(400).json({ error: "É necessário enviar o nome e e-mail." });
	}

	// Check fields
	if (name !== undefined && !(await schema.name.isValid(name))) {
		fields.push("name");
	}
	if (email !== undefined && !(await schema.email.isValid(email))) {
		fields.push("email");
	}
	if (password !== undefined && !(await schema.password.isValid(password))) {
		fields.push("password");
	}
	if (roles === undefined || !(await schema.roles.isValid(roles)) || !checkRoles(validRoles, roles)) {
		fields.push("roles");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};
