const express = require("express");
const router = express.Router();
const { protect, admin } = require("../../middlewares/authMiddleware");
const { getDashboard } = require("../../controllers/admin/dashboardController");

router.use(protect);
router.use(admin);

router.get("/", getDashboard);

module.exports = router;
