const express = require("express");
const router = express.Router();
const controller = require("../controllers/helpdesk.controller");

router.get("/", controller.listAll);
router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.post("/buscar", controller.getById);
router.put("/:id", controller.update);
router.delete("/", controller.delete);

module.exports = router;