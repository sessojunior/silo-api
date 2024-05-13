const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Problems = require("../models/problems")(sequelize, Sequelize.DataTypes);
const ProblemCategories = require("../models/problemcategories")(sequelize, Sequelize.DataTypes);
const ProblemsVsProblemCategories = require("../models/problemsvsproblemcategories")(sequelize, Sequelize.DataTypes);

// [POST] /problemsvsproblemcategories
// req.body:
// {
// 	 "problemId": 1,
// 	 "problemCategoryId": 1
// }
module.exports.addProblemVsProblemCategory = async (req, res) => {
	console.log(`Url requisitada (addProblemVsProblemCategory): ${req.url}`);

	const problemId = parseInt(req.body.problemId) || 0;
	const problemCategoryId = parseInt(req.body.problemCategoryId) || 0;

	// Required fields
	if (problemId <= 0 || problemCategoryId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema e a categoria de problemas." });
	}

	if (await ProblemsVsProblemCategories.findOne({ where: { [Op.and]: [{ problemId: problemId }, { problemCategoryId: problemCategoryId }] } })) {
		return res.status(400).json({ error: "Já existe um relacionamento entre este problema e esta categoria de problemas." });
	}

	const problem = await Problems.findByPk(problemId);
	if (!problem) {
		return res.status(404).json({ error: "Não existe um problema com este ID." });
	}

	const problemCategory = await ProblemCategories.findByPk(problemCategoryId);
	if (!problemCategory) {
		return res.status(404).json({ error: "Não existe uma categoria de problemas com este ID." });
	}

	await ProblemsVsProblemCategories.create({
		problemId: problemId,
		problemCategoryId: problemCategoryId,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				problemId: data.problemId,
				problemCategoryId: data.problemCategoryId,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /problemsvsproblemcategories
// req.query: /problemsvsproblemcategories?problemId=1
// req.query: /problemsvsproblemcategories?problemCategoryId=1
module.exports.getProblemVsProblemCategory = async (req, res) => {
	console.log(`Url requisitada (getProblemVsProblemCategory): ${req.url}`);

	const problemId = parseInt(req.query.problemId) || 0;
	const problemCategoryId = parseInt(req.query.problemCategoryId) || 0;

	// Required fields
	if (problemId <= 0 && problemCategoryId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema ou a categoria de problemas." });
	}

	if (problemId > 0) {
		const problem = await Problems.findByPk(problemId);
		if (!problem) {
			return res.status(404).json({ error: "Não existe um problema com este ID." });
		}

		await ProblemsVsProblemCategories.findAll({ where: { problemId: problemId } })
			.then((data) => {
				res.status(200).json({
					data: data,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(404).json({ error: "Não existe uma categoria de problemas para este problema." });
			});
	}

	if (problemCategoryId > 0) {
		const problemCategory = await ProblemCategories.findByPk(problemCategoryId);
		if (!problemCategory) {
			return res.status(404).json({ error: "Não existe uma categoria de problemas com este ID." });
		}

		await ProblemsVsProblemCategories.findAll({ where: { problemCategoryId: problemCategoryId } })
			.then((data) => {
				res.status(200).json({
					data: data,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(404).json({ error: "Não existe um problema com esta categoria de problemas." });
			});
	}
};

// [DELETE] /problemsvsproblemcategories
// req.query: /problemsvsproblemcategories?problemId=1&problemCategoryId=1
module.exports.deleteProblemVsProblemCategory = async (req, res) => {
	console.log(`Url requisitada (deleteProblemVsProblemCategory): ${req.url}`);

	const problemId = parseInt(req.query.problemId) || 0;
	const problemCategoryId = parseInt(req.query.problemCategoryId) || 0;

	// Required fields
	if (problemId <= 0 || problemCategoryId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema e a categoria de problemas." });
	}

	if (!(await ProblemsVsProblemCategories.findOne({ where: { [Op.and]: [{ problemId: problemId }, { problemCategoryId: problemCategoryId }] } }))) {
		return res.status(400).json({
			error: "Não existe um relacionamento entre este problema e esta categoria de problemas.",
			details: { problemId: problemId, problemCategoryId: problemCategoryId },
		});
	}

	await ProblemsVsProblemCategories.destroy({ where: { [Op.and]: [{ problemId: problemId }, { problemCategoryId: problemCategoryId }] } })
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			return res.status(400).json({
				error: "Não existe um relacionamento entre este problema e esta categoria de problemas.",
				details: { problemId: problemId, problemCategoryId: problemCategoryId },
			});
		});
};
