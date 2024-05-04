const express = require("express");
const router = express.Router();

// Controllers
const { getUsers, addUser, getUser, updateUser, deleteUser } = require("./controllers/users.controller");
const { getServices, addService, getService, updateService, deleteService } = require("./controllers/services.controller");

// Middlewares
const { checkAddUser, checkUpdateUser } = require("./middlewares/users.middleware");
const { checkAddService, checkUpdateService } = require("./middlewares/services.middleware");

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

// Routes: 404 (Not Found)
router.all("*", (req, res) => {
	res.status(404).end();
});

module.exports = router;
