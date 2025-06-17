const express = require("express");
const router = express.Router();
const controller = require("../controllers/contatos.controller");

router.get("/", controller.listAll);
router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.post("/buscar", controller.findByCell);
router.delete('/apagar', controller.deleteByIdAndEmpresaId);

module.exports = router;