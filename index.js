const { app, environment, port } = require("./config");
const bodyParser = require("body-parser");

// Routes
const routes = require("./routes");

// Routes
app.use(routes);

// Server
app.listen(port, (err) => {
	if (err) {
		console.error("Não foi possível conectar ao servidor.", err);
	}
	console.log(`Servidor (${environment}) rodando na porta ${port}...`);
});
