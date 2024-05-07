const express = require("express");
const router = express.Router();

// Controllers
const { getUsers, addUser, getUser, updateUser, deleteUser } = require("./controllers/users.controller");
const { getServices, addService, getService, updateService, deleteService } = require("./controllers/services.controller");
const { getTasks, addTask, getTask, updateTask, deleteTask } = require("./controllers/tasks.controller");
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("./controllers/problems.controller");

// Middlewares
const { checkAddUser, checkUpdateUser } = require("./middlewares/users.middleware");
const { checkDataService } = require("./middlewares/services.middleware");
const { checkDataTask } = require("./middlewares/tasks.middleware");
const { checkDataProblem } = require("./middlewares/problems.middleware");

// Routes: /users
router.get("/users", getUsers);
router.post("/users", checkAddUser, addUser);
router.get("/users/:id", getUser);
router.put("/users/:id", checkUpdateUser, updateUser);
router.delete("/users/:id", deleteUser);

// Routes: /services
router.get("/services", getServices);
router.post("/services", checkDataService, addService);
router.get("/services/:id", getService);
router.put("/services/:id", checkDataService, updateService);
router.delete("/services/:id", deleteService);

// Routes: /tasks
router.get("/tasks", getTasks);
router.post("/tasks", checkDataTask, addTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", checkDataTask, updateTask);
router.delete("/tasks/:id", deleteTask);

// Routes: /problems
router.get("/problems", getProblems);
router.post("/problems", checkDataProblem, addProblem);
router.get("/problems/:id", getProblem);
router.put("/problems/:id", checkDataProblem, updateProblem);
router.delete("/problems/:id", deleteProblem);

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
