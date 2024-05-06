const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
	serviceId: yup.number().min(1),
};

// Add Task
module.exports.checkAddTask = async (req, res, next) => {
	console.log(`Middleware (checkAddTask)`);

	const { name, serviceId } = req.body;
	let fields = [];

	// Check fields
	if (name === undefined || !(await schema.name.isValid(name))) {
		fields.push("name");
	}
	if (serviceId === undefined || !(await schema.serviceId.isValid(serviceId))) {
		fields.push("serviceId");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};

module.exports.checkUpdateTask = async (req, res, next) => {
	console.log(`Middleware (checkUpdateTask)`);

	const { name, serviceId } = req.body;
	let fields = [];

	// Required fields
	if (name === undefined) {
		return res.status(400).json({ error: "Nenhum dado requerido foi enviado." });
	}

	// Check fields
	if (name !== undefined && !(await schema.name.isValid(name))) {
		fields.push("name");
	}
	if (serviceId !== undefined && !(await schema.serviceId.isValid(serviceId))) {
		fields.push("serviceId");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};
