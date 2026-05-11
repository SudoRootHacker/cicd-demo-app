const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Pipeline demo app working"
  });
});

module.exports = router;
