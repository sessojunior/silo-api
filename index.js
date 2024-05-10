const { app, environment, port } = require("./config");
const bodyParser = require("body-parser");

// Import routes
const routes = require("./routes");
const authRoutes = require("./routes/auth");

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Server
app.listen(port, (err) => {
	if (err) {
		console.error("Não foi possível conectar ao servidor.", err);
	}
	console.log(`Servidor (${environment}) rodando na porta ${port}...`);
});
