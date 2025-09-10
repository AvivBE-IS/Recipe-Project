const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { recipeSchema } = require("../data/recipeSchema");

const ajv = new Ajv({
  allErrors: true, // collect all errors (nice for debugging)
  coerceTypes: true, // "30" -> 30 for integers, etc.
  removeAdditional: true, // strip props not in schema
});
addFormats(ajv);

const validateRecipe = ajv.compile(recipeSchema);

function recipeValidation(req, res, next) {
  console.log("recipeValidation");
  const valid = validateRecipe(req.body);

  if (valid) return next();

  // Build a readable error message from the first error
  const [err] = validateRecipe.errors;
  const where = err.instancePath || "body";
  const error = new Error(
    `Recipe validation error at ${where}: ${err.message}`
  );
  error.status = 400;
  // Optional: attach full errors array for your error handler/logs
  error.details = validateRecipe.errors;
  return next(error);
}

module.exports = { recipeValidation, validateRecipe };
