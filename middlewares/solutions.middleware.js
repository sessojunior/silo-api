const yup = require("yup");

// Schema
const schema = {
	description: yup.string().trim().required(),
};

module.exports.checkDataSolution = async (req, res, next) => {
	console.log(`Middleware (checkDataService)`);

	const { description } = req.body;
	let fields = [];

	// Check fields
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
