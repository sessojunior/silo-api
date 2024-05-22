const { app, environment, port } = require("./config");
const bodyParser = require("body-parser");

// Swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-gen.json");

// Import routes
const routes = require("./routes");
const authRoutes = require("./routes/auth");

// Swagger documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Server
const server = app.listen(port, (err) => {
	if (err) {
		console.error("Não foi possível conectar ao servidor.", err);
	}
	console.log(`Servidor (${environment}) rodando na porta ${port}...`);
});

module.exports = { app, server };
