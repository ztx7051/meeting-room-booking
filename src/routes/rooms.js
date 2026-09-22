const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const auth = require("../middlewares/auth");

const ctrl = require("../controllers/rooms");

router.get("/", ctrl.list);
router.get("/:id", ctrl.listById);
router.post("/", auth, requireAdmin, ctrl.create);
router.put("/:id", auth, requireAdmin, ctrl.update);
router.delete("/:id", auth, requireAdmin, ctrl.delete);

module.exports = router;
