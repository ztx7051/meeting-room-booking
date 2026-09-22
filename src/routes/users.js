const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const auth = require("../middlewares/auth");

const ctrl = require("../controllers/users");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", auth, requireAdmin, ctrl.addUser);
router.put("/:id", auth, requireAdmin, ctrl.updateUser);
router.delete("/:id", auth, requireAdmin, ctrl.deleteUser);

module.exports = router;
