const express = require("express");
const router = express.Router();
const controller = require("../controllers/helpdesk.controller");

router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.delete("/apagar", controller.delete);

module.exports = router;