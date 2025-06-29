const express = require("express");
const router = express.Router();
const controller = require("../controllers/sistemas.controller");

router.get("/:empresa_id", controller.list);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
