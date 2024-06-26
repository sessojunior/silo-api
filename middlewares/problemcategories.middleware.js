const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
};

module.exports.checkDataProblemCategory = async (req, res, next) => {
	console.log(`Middleware (checkDataProblemCategory)`);

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
