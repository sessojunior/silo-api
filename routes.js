const express = require("express");
const router = express.Router();

// Controllers
const { getUsers, addUser, getUser, updateUser, deleteUser } = require("./controllers/users.controller");
const { getServices, addService, getService, updateService, deleteService } = require("./controllers/services.controller");
const { getTasks, addTask, getTask, updateTask, deleteTask } = require("./controllers/tasks.controller");
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("./controllers/problems.controller");

// Middlewares
const { checkAddUser, checkUpdateUser } = require("./middlewares/users.middleware");
const { checkAddService, checkUpdateService } = require("./middlewares/services.middleware");
const { checkAddTask, checkUpdateTask } = require("./middlewares/tasks.middleware");
const { checkAddProblem, checkUpdateProblem } = require("./middlewares/problems.middleware");

// Routes: /users
router.get("/users", getUsers);
router.post("/users", checkAddUser, addUser);
router.get("/users/:id", getUser);
router.put("/users/:id", checkUpdateUser, updateUser);
router.delete("/users/:id", deleteUser);

// Routes: /services
router.get("/services", getServices);
router.post("/services", checkAddService, addService);
router.get("/services/:id", getService);
router.put("/services/:id", checkUpdateService, updateService);
router.delete("/services/:id", deleteService);

// Routes: /tasks
router.get("/tasks", getTasks);
router.post("/tasks", checkAddTask, addTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", checkUpdateTask, updateTask);
router.delete("/tasks/:id", deleteTask);

// Routes: /problems
router.get("/problems", getProblems);
router.post("/problems", checkAddProblem, addProblem);
router.get("/problems/:id", getProblem);
router.put("/problems/:id", checkUpdateProblem, updateProblem);
router.delete("/problems/:id", deleteProblem);

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
