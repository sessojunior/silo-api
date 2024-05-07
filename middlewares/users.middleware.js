const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
	email: yup.string().trim().email().required(),
	password: yup.string().min(6).max(30).required(),
};

// Add
module.exports.checkAddUser = async (req, res, next) => {
	console.log(`Middleware (checkAddUser)`);

	const { name, email, password } = req.body;
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

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};

// Update
module.exports.checkUpdateUser = async (req, res, next) => {
	console.log(`Middleware (checkUpdateUser)`);

	const { name, email, password } = req.body;
	let fields = [];

	// Required fields
	if (name === undefined && email === undefined && password === undefined) {
		return res.status(400).json({ error: "Nenhum dado requerido foi enviado." });
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

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};
