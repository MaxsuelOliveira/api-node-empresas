const express = require("express");
const router = express.Router();
const controller = require("../controllers/servidor.controller");

router.get("/", controller.listAll);
router.get("/:id", controller.getById);
router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
