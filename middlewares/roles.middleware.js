const yup = require("yup");

// Schema
const schema = {
	name: yup.string().trim().required(),
};

module.exports.checkDataRole = async (req, res, next) => {
	console.log(`Middleware (checkDataRole)`);

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
