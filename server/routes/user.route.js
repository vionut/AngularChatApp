const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.post("/register", user_controller.user_create);

router.post("/login", user_controller.user_login);

router.get("/", user_controller.users_get);

router.get("/user", user_controller.user_get);

router.put("/updateUser", user_controller.user_update);

router.delete("/delete", user_controller.user_delete);

module.exports = router;
