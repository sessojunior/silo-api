const yup = require("yup");

// Schema
const schema = {
	serviceId: yup.number().min(1),
	name: yup.string().trim().required(),
	description: yup.string().trim().required(),
};

// Add
module.exports.checkTask = async (req, res, next) => {
	console.log(`Middleware (checkTask)`);

	const { serviceId, name, description } = req.body;
	let fields = [];

	// Check fields
	if (serviceId === undefined || !(await schema.serviceId.isValid(serviceId))) {
		fields.push("serviceId");
	}
	if (name === undefined || !(await schema.name.isValid(name))) {
		fields.push("name");
	}
	if (description === undefined || !(await schema.description.isValid(name))) {
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
