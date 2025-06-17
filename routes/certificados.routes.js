const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificados.controller");

router.get("/:empresa_id", controller.list);
router.post("/buscar", controller.getById);
router.post("/", controller.create);
router.put("/atualizar", controller.update);
router.delete("/apagar", controller.delete);

module.exports = router;