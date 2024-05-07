const express = require("express");
const router = express.Router();

// Controllers
const { getUsers, addUser, getUser, updateUser, deleteUser } = require("./controllers/users.controller");
const { getServices, addService, getService, updateService, deleteService } = require("./controllers/services.controller");
const { getTasks, addTask, getTask, updateTask, deleteTask } = require("./controllers/tasks.controller");
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("./controllers/problems.controller");

// Middlewares
const { checkUser } = require("./middlewares/users.middleware");
const { checkService } = require("./middlewares/services.middleware");
const { checkTask } = require("./middlewares/tasks.middleware");
const { checkProblem } = require("./middlewares/problems.middleware");

// Routes: /users
router.get("/users", getUsers);
router.post("/users", checkUser, addUser);
router.get("/users/:id", getUser);
router.put("/users/:id", checkUser, updateUser);
router.delete("/users/:id", deleteUser);

// Routes: /services
router.get("/services", getServices);
router.post("/services", checkService, addService);
router.get("/services/:id", getService);
router.put("/services/:id", checkService, updateService);
router.delete("/services/:id", deleteService);

// Routes: /tasks
router.get("/tasks", getTasks);
router.post("/tasks", checkTask, addTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", checkTask, updateTask);
router.delete("/tasks/:id", deleteTask);

// Routes: /problems
router.get("/problems", getProblems);
router.post("/problems", checkProblem, addProblem);
router.get("/problems/:id", getProblem);
router.put("/problems/:id", checkProblem, updateProblem);
router.delete("/problems/:id", deleteProblem);

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
