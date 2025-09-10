const express = require("express");
const { recipeValidation } = require("../middleware/recipeValidation");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

router.get("/", (req, res) => {
  res.send("Express server is running");
});

router.post("/recipes", recipeValidation, (req, res) => {
  // req.body is now validated & cleaned (extra props removed if any)
  // ...create recipe...
  res.status(201).json({ ok: true });
});

router.put("/recipes/:id", recipeValidation, (req, res) => {
  // ...update full recipe...
  res.json({ ok: true });
});

module.exports = router;
