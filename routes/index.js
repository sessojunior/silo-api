const express = require("express");
const router = express.Router();

// Controllers
const { getUsers, addUser, getUser, updateUser, deleteUser } = require("../controllers/users.controller");
const { getServices, addService, getService, updateService, deleteService } = require("../controllers/services.controller");
const { getTasks, addTask, getTask, updateTask, deleteTask } = require("../controllers/tasks.controller");
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("../controllers/problems.controller");
const { getProblemCategories, addProblemCategory, getProblemCategory, updateProblemCategory, deleteProblemCategory } = require("../controllers/problemcategories.controller");
const { getSolutions, addSolution, getSolution, updateSolution, deleteSolution } = require("../controllers/solutions.controller");
const { getProblemVsSolution, addProblemVsSolution, deleteProblemVsSolution } = require("../controllers/problemsvssolutions.controller");
const { getProblemVsProblemCategory, addProblemVsProblemCategory, deleteProblemVsProblemCategory } = require("../controllers/problemsvsproblemcategories.controller");

// Middlewares
const { checkAddUser, checkUpdateUser } = require("../middlewares/users.middleware");
const { checkDataService } = require("../middlewares/services.middleware");
const { checkDataTask } = require("../middlewares/tasks.middleware");
const { checkDataProblem } = require("../middlewares/problems.middleware");
const { checkDataProblemCategory } = require("../middlewares/problemcategories.middleware");
const { checkDataSolution } = require("../middlewares/solutions.middleware");

// Routes: /api/users
router.get("/users", getUsers);
router.post("/users", checkAddUser, addUser);
router.get("/users/:id", getUser);
router.put("/users/:id", checkUpdateUser, updateUser);
router.delete("/users/:id", deleteUser);

// Routes: /api/services
router.get("/services", getServices);
router.post("/services", checkDataService, addService);
router.get("/services/:id", getService);
router.put("/services/:id", checkDataService, updateService);
router.delete("/services/:id", deleteService);

// Routes: /api/tasks
router.get("/tasks", getTasks);
router.post("/tasks", checkDataTask, addTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", checkDataTask, updateTask);
router.delete("/tasks/:id", deleteTask);

// Routes: /api/problems
router.get("/problems", getProblems);
router.post("/problems", checkDataProblem, addProblem);
router.get("/problems/:id", getProblem);
router.put("/problems/:id", checkDataProblem, updateProblem);
router.delete("/problems/:id", deleteProblem);

// Routes: /api/problemcategories
router.get("/problemcategories", getProblemCategories);
router.post("/problemcategories", checkDataProblemCategory, addProblemCategory);
router.get("/problemcategories/:id", getProblemCategory);
router.put("/problemcategories/:id", checkDataProblemCategory, updateProblemCategory);
router.delete("/problemcategories/:id", deleteProblemCategory);

// Routes: /api/solutions
router.get("/solutions", getSolutions);
router.post("/solutions", checkDataSolution, addSolution);
router.get("/solutions/:id", getSolution);
router.put("/solutions/:id", checkDataSolution, updateSolution);
router.delete("/solutions/:id", deleteSolution);

// Routes: /api/problemsvssolutions
router.post("/problemsvssolutions", addProblemVsSolution);
router.get("/problemsvssolutions", getProblemVsSolution);
router.delete("/problemsvssolutions", deleteProblemVsSolution);

// Routes: /api/problemsvssolutions
router.post("/problemsvsproblemcategories", addProblemVsProblemCategory);
router.get("/problemsvsproblemcategories", getProblemVsProblemCategory);
router.delete("/problemsvsproblemcategories", deleteProblemVsProblemCategory);

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
