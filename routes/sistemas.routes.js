const express = require("express");
const router = express.Router();
const controller = require("../controllers/sistemas.controller");

// Rota para criar um novo sistema
router.post("/", controller.create);
router.get("/:empresa_id", controller.list);
router.delete("/apagar", controller.delete);
router.put("/atualizar", controller.update);
router.post("/buscar", controller.getById);

module.exports = router;