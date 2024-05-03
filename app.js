const express = require("express");
const app = express();
const port = 3030;

app.use("/", (req, res) => {
	res.send("Hello");
});

app.listen(port, (err) => {
	if (err) {
		console.log("Ocorreu um erro!");
		throw err;
	}
	console.log(`Servidor rodando na porta ${port}`);
});
