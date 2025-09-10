// recipe.schema.js
const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" }, // optional; server can generate
    title: { type: "string", maxLength: 100 },
    description: { type: "string", maxLength: 500 },
    ingredients: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    instructions: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    cookingTime: { type: "integer", minimum: 0, maximum: 1440 }, // minutes, up to 24h
    servings: { type: "integer", minimum: 1, maximum: 100 },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    rating: { type: "number", minimum: 0, maximum: 5 },
    createdAt: { type: "string", format: "date-time" },
  },
  required: [
    "title",
    "ingredients",
    "instructions",
    "cookingTime",
    "servings",
    "difficulty",
  ],
  additionalProperties: false,
};

module.exports = { recipeSchema };
