const { app, server } = require("../index.js");
const supertest = require("supertest");

let token = undefined;

// Auth token test
describe("Teste de autenticação", () => {
	test("Obter token", async () => {
		const res = await supertest(app).post("/api/auth").send({
			email: "mario@teste.com",
			password: "123456",
		});
		console.log("error", res.error.text !== undefined ? res.error.text : false);
		expect(res.statusCode).toBe(200);
		console.log("token", res.body.token !== undefined ? res.body.token : false);
		token = res.body.token;
	});
});

describe("Teste de CRUD de usuários", () => {
	test("Criar usuário", async () => {
		const res = await supertest(app)
			.post("/api/users")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Fernanda",
				email: "fernanda@teste.com",
				password: "123456",
				roles: ["editor", "viewer"],
			});
		console.log("error", res.error.text !== undefined ? res.error.text : false);
		expect(res.statusCode).toBe(201);
	});

	test("Obter lista de usuários", async () => {
		const res = await supertest(app).get("/api/users").set("Authorization", `Bearer ${token}`);
		console.log("error", res.error.text !== undefined ? res.error.text : false);
		expect(res.statusCode).toBe(200);
	});
});

// Disconnect after all tests
afterAll(() => {
	console.log("Desconectar servidor Jest app.listen()");
	server.close();
});
