const express = require("express");
const router = express.Router();
const controller = require("../controllers/empresas.controller");

const { auth, isAdmin } = require("../middlewares/auth");

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", auth, isAdmin, controller.create);
router.post("/buscar_empresa", controller.findByCnpjOrNomecompleto);
router.put("/", auth, isAdmin, controller.update);
router.delete("/", auth, isAdmin, controller.delete);

module.exports = router;
