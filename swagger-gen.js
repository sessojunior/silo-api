const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger-gen.json";
const endpointsFiles = ["./routes/auth.js", "./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
	const { server } = require("./index.js");
	server.close();
});
