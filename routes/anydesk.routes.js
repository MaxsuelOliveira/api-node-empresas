const express = require("express");
const router = express.Router();
const controller = require("../controllers/anydesk.controller");

router.get("/:empresa_id", controller.list);
router.get("/", controller.listAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/", controller.delete);

module.exports = router;