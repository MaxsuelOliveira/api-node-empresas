const express = require("express");
const router = express.Router();
const controller = require("../controllers/empresas.controller");

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/buscar", controller.findByCnpjOrNomecompleto);
router.put("/atualizar", controller.update);
router.delete("/apagar", controller.delete);

module.exports = router;