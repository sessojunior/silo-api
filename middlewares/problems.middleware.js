const yup = require("yup");

// Schema
const schema = {
	taskId: yup.number().min(1),
	title: yup.string().trim().required(),
	description: yup.string().trim().required(),
};

// Add
module.exports.checkAddProblem = async (req, res, next) => {
	console.log(`Middleware (checkAddProblem)`);

	const { taskId, title, description } = req.body;
	let fields = [];

	// Check fields
	if (taskId === undefined || !(await schema.taskId.isValid(taskId))) {
		fields.push("taskId");
	}
	if (title === undefined || !(await schema.title.isValid(title))) {
		fields.push("title");
	}
	if (description === undefined || !(await schema.description.isValid(description))) {
		fields.push("description");
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
module.exports.checkUpdateProblem = async (req, res, next) => {
	console.log(`Middleware (checkUpdateProblem)`);

	const { taskId, title, description } = req.body;
	let fields = [];

	// Required fields
	if (taskId === undefined) {
		return res.status(400).json({ error: "Nenhum dado requerido foi enviado." });
	}

	// Check fields
	if (taskId !== undefined && !(await schema.taskId.isValid(taskId))) {
		fields.push("taskId");
	}
	if (title !== undefined && !(await schema.title.isValid(title))) {
		fields.push("title");
	}
	if (description !== undefined && !(await schema.description.isValid(description))) {
		fields.push("description");
	}

	if (fields.length > 0) {
		return res.status(400).json({
			error: "Um ou mais dados são inválidos.",
			invalid_fields: fields,
		});
	}

	return next();
};
