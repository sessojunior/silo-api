const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const Problems = require("../models/problems")(sequelize, Sequelize.DataTypes);
const Solutions = require("../models/solutions")(sequelize, Sequelize.DataTypes);
const ProblemsVsSolutions = require("../models/problemsvssolutions")(sequelize, Sequelize.DataTypes);

// [POST] /problemsvssolutions
// req.body:
// {
// 	 "problemId": 1,
// 	 "solutionId": 1
// }
module.exports.addProblemVsSolution = async (req, res) => {
	console.log(`Url requisitada (addProblemVsSolution): ${req.url}`);

	const problemId = parseInt(req.body.problemId) || 0;
	const solutionId = parseInt(req.body.solutionId) || 0;

	// Required fields
	if (problemId <= 0 || solutionId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema e a solução." });
	}

	if (await ProblemsVsSolutions.findOne({ where: { [Op.and]: [{ problemId: problemId }, { solutionId: solutionId }] } })) {
		return res.status(400).json({ error: "Já existe um relacionamento entre este problema e esta solução." });
	}

	const problem = await Problems.findByPk(problemId);
	if (!problem) {
		return res.status(404).json({ error: "Não existe um problema com este ID." });
	}

	const solution = await Solutions.findByPk(solutionId);
	if (!solution) {
		return res.status(404).json({ error: "Não existe uma solução com este ID." });
	}

	await ProblemsVsSolutions.create({
		problemId: problemId,
		solutionId: solutionId,
	})
		.then((data) => {
			res.status(201).json({
				id: data.id,
				problemId: data.problemId,
				solutionId: data.solutionId,
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

// [GET] /problemsvssolutions
// req.query: /problemsvssolutions?problemId=1
// req.query: /problemsvssolutions?solutionId=1
module.exports.getProblemVsSolution = async (req, res) => {
	console.log(`Url requisitada (getProblemVsSolution): ${req.url}`);

	const problemId = parseInt(req.query.problemId) || 0;
	const solutionId = parseInt(req.query.solutionId) || 0;

	// Required fields
	if (problemId <= 0 && solutionId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema ou a solução." });
	}

	if (problemId > 0) {
		const problem = await Problems.findByPk(problemId);
		if (!problem) {
			return res.status(404).json({ error: "Não existe um problema com este ID." });
		}

		await ProblemsVsSolutions.findAll({ where: { problemId: problemId } })
			.then((data) => {
				res.status(200).json({
					data: data,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(404).json({ error: "Não existe uma solução para este problema." });
			});
	}

	if (solutionId > 0) {
		const solution = await Solutions.findByPk(solutionId);
		if (!solution) {
			return res.status(404).json({ error: "Não existe uma solução com este ID." });
		}

		await ProblemsVsSolutions.findAll({ where: { solutionId: solutionId } })
			.then((data) => {
				res.status(200).json({
					data: data,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(404).json({ error: "Não existe um problema para esta solução." });
			});
	}
};

// [DELETE] /problemsvssolutions
// req.query: /problemsvssolutions?problemId=1&solutionId=1
module.exports.deleteProblemVsSolution = async (req, res) => {
	console.log(`Url requisitada (deleteProblemVsSolution): ${req.url}`);

	const problemId = parseInt(req.query.problemId) || 0;
	const solutionId = parseInt(req.query.solutionId) || 0;

	// Required fields
	if (problemId <= 0 || solutionId <= 0) {
		return res.status(400).json({ error: "É necessário enviar o problema e a solução." });
	}

	if (!(await ProblemsVsSolutions.findOne({ where: { [Op.and]: [{ problemId: problemId }, { solutionId: solutionId }] } }))) {
		return res.status(400).json({
			error: "Não existe um relacionamento entre este problema e esta solução.",
			details: { problemId: problemId, solutionId: solutionId },
		});
	}

	await ProblemsVsSolutions.destroy({ where: { [Op.and]: [{ problemId: problemId }, { solutionId: solutionId }] } })
		.then((data) => {
			res.status(200).json();
		})
		.catch((err) => {
			return res.status(400).json({
				error: "Não existe um relacionamento entre este problema e esta solução.",
				details: { problemId: problemId, solutionId: solutionId },
			});
		});
};
