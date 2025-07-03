const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarios.controller");


router.post("/login", controller.login);
router.get("/usuarios", controller.list);
router.get("/usuarios/:id", controller.getById);
router.post("/usuarios", controller.create);
router.put("/usuarios/", controller.update);
router.delete("/usuarios/", controller.delete);

module.exports = router;
