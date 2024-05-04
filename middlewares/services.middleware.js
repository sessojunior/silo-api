const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
};

// Add User
module.exports.checkAddService = async (req, res, next) => {
	console.log(`Middleware (checkAddService)`);

	const { name } = req.body;
	let fields = [];

	// Check fields
	if (name === undefined || !(await schema.name.isValid(name))) {
		fields.push("name");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};

module.exports.checkUpdateService = async (req, res, next) => {
	console.log(`Middleware (checkUpdateService)`);

	const { name } = req.body;
	let fields = [];

	// Required fields
	if (name === undefined) {
		return res.status(400).json({ error: "Nenhum dado requerido foi enviado." });
	}

	// Check fields
	if (name !== undefined && !(await schema.name.isValid(name))) {
		fields.push("name");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};
