const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/rooms");

router.get("/", ctrl.list);
router.get("/:id", ctrl.listById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
