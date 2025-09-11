const express = require("express");
const { recipeValidation } = require("../middleware/recipeValidation");
const router = express.Router();
const data = require("../data/recipes.json");
const allowedDifficulties = new Set(["easy", "medium", "hard"]);

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Helpers (keep using your existing `allowedDifficulties` and `data`)
function validateDifficulty(difficulty, res) {
  if (
    difficulty &&
    !allowedDifficulties.has(String(difficulty).toLowerCase())
  ) {
    res
      .status(400)
      .json({ error: "Invalid 'difficulty'. Use easy|medium|hard." });
    return false;
  }
  return true;
}

function validateMaxCookingTime(maxCookingTime, res) {
  if (maxCookingTime !== undefined && maxCookingTime !== "") {
    const max = Number(maxCookingTime);
    if (!Number.isFinite(max) || max < 0) {
      res
        .status(400)
        .json({
          error: "Invalid 'maxCookingTime'. Must be a non-negative number.",
        });
      return false;
    }
  }
  return true;
}

function copyData(list) {
  return list.slice();
}

function applyDifficultyFilter(list, difficulty) {
  if (!difficulty) return list;
  const d = String(difficulty).toLowerCase();
  return list.filter((r) => (r.difficulty || "").toLowerCase() === d);
}

function applyMaxCookingTimeFilter(list, maxCookingTime) {
  if (maxCookingTime === undefined || maxCookingTime === "") return list;
  const max = Number(maxCookingTime);
  if (!Number.isFinite(max)) return list;
  return list.filter((r) => Number(r.cookingTime) <= max);
}

function applySearchFilter(list, search) {
  if (!search) return list;
  const q = String(search).toLowerCase();
  return list.filter(
    (r) =>
      (r.title || "").toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q)
  );
}

// Route
router.get("/", (req, res, next) => {
  try {
    const { difficulty, maxCookingTime, search } = req.query;
    console.log("filters:", { difficulty, maxCookingTime, search });

    // Keep the same validation logic and messages
    if (!validateDifficulty(difficulty, res)) return;
    if (!validateMaxCookingTime(maxCookingTime, res)) return;

    // (Duplicate validation preserved to keep structure/logic identical)
    if (!validateDifficulty(difficulty, res)) return;
    if (!validateMaxCookingTime(maxCookingTime, res)) return;

    let results = copyData(data);
    results = applyDifficultyFilter(results, difficulty);
    results = applyMaxCookingTimeFilter(results, maxCookingTime);
    results = applySearchFilter(results, search);

    console.log("results:\n", JSON.stringify(results, null, 2));
    return res
      .status(200)
      .type("application/json")
      .send(JSON.stringify(results, null, 2));
  } catch (e) {
    return next(e);
  }
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
