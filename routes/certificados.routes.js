const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificados.controller");

router.get("/:id", controller.getById);
router.get("/", controller.listAll);
router.get("/expiring", controller.listExpiring);
router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/", controller.delete);

module.exports = router;