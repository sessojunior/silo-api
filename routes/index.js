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

const { auth } = require("../middlewares/auth.middleware");
const { admin, editor, viewer } = require("../middlewares/roles.middleware");

// Routes: /api/users
router.get("/users", [auth, admin], getUsers);
router.post("/users", [auth, admin, checkAddUser], addUser);
router.get("/users/:id", [auth, viewer], getUser);
router.put("/users/:id", [auth, editor, checkUpdateUser], updateUser);
router.delete("/users/:id", [auth, admin], deleteUser);

// Routes: /api/services
router.get("/services", [auth, viewer], getServices);
router.post("/services", [auth, editor, checkDataService], addService);
router.get("/services/:id", [auth, viewer], getService);
router.put("/services/:id", [auth, editor, checkDataService], updateService);
router.delete("/services/:id", [auth, editor], deleteService);

// Routes: /api/tasks
router.get("/tasks", [auth, viewer], getTasks);
router.post("/tasks", [auth, editor, checkDataTask], addTask);
router.get("/tasks/:id", [auth, viewer], getTask);
router.put("/tasks/:id", [auth, editor, checkDataTask], updateTask);
router.delete("/tasks/:id", [auth, editor], deleteTask);

// Routes: /api/problems
router.get("/problems", [auth, viewer], getProblems);
router.post("/problems", [auth, editor, checkDataProblem], addProblem);
router.get("/problems/:id", [auth, viewer], getProblem);
router.put("/problems/:id", [auth, editor, checkDataProblem], updateProblem);
router.delete("/problems/:id", [auth, editor], deleteProblem);

// Routes: /api/problemcategories
router.get("/problemcategories", [auth, viewer], getProblemCategories);
router.post("/problemcategories", [auth, editor, checkDataProblemCategory], addProblemCategory);
router.get("/problemcategories/:id", [auth, viewer], getProblemCategory);
router.put("/problemcategories/:id", [auth, editor, checkDataProblemCategory], updateProblemCategory);
router.delete("/problemcategories/:id", [auth, editor], deleteProblemCategory);

// Routes: /api/solutions
router.get("/solutions", [auth, viewer], getSolutions);
router.post("/solutions", [auth, editor, checkDataSolution], addSolution);
router.get("/solutions/:id", [auth, viewer], getSolution);
router.put("/solutions/:id", [auth, editor, checkDataSolution], updateSolution);
router.delete("/solutions/:id", [auth, editor], deleteSolution);

// Routes: /api/problemsvssolutions
router.post("/problemsvssolutions", [auth, editor], addProblemVsSolution);
router.get("/problemsvssolutions", [auth, viewer], getProblemVsSolution);
router.delete("/problemsvssolutions", [auth, editor], deleteProblemVsSolution);

// Routes: /api/problemsvsproblemcategories
router.post("/problemsvsproblemcategories", [auth, editor], addProblemVsProblemCategory);
router.get("/problemsvsproblemcategories", [auth, viewer], getProblemVsProblemCategory);
router.delete("/problemsvsproblemcategories", [auth, editor], deleteProblemVsProblemCategory);

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
