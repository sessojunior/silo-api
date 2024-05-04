const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

// App
const app = express();

// CORS
app.use(cors());

// JSON, bodyParser
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);

// Bad request or Malformed JSON
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		console.log("Erro de bad request ou JSON mal formado:", err.body);
		return res.status(400).send({ error: err });
	}
	next();
});

// Environment
dotenv.config();
const environment = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3030;

// Database
const config = require("./config/config.json")[environment];
const sequelize = new Sequelize(config);

sequelize
	.authenticate()
	.then(function (err) {
		console.log("Conexão com o banco de dados estabelecida com sucesso.");
	})
	.catch(function (err) {
		console.log("Não foi possível estabelecer a conexão com o banco de dados:", err);
	});

module.exports = { app, environment, port, sequelize };
