import test from "node:test";
import assert from "node:assert/strict";
import { scaleIngredient, readShopping } from "../src/lib/quantities.ts";
test("scales decimals, fractions, mixed fractions, and ranges without changing preparation text", () => {
  assert.equal(
    scaleIngredient("1.2 kg boneless chicken", 2),
    "2.4 kg boneless chicken",
  );
  assert.equal(scaleIngredient("1/2 tsp oregano", 3), "1.5 tsp oregano");
  assert.equal(scaleIngredient("1 1/2 cups stock", 2), "3 cups stock");
  assert.equal(
    scaleIngredient("3-4 chipotle chiles", 0.5),
    "1.5–2 chipotle chiles",
  );
  assert.equal(scaleIngredient("Salt to taste", 2), "Salt to taste");
  assert.equal(
    scaleIngredient("400 g tomatoes (or 4 tomatoes)", 0.5),
    "200 g tomatoes (or 2 tomatoes)",
  );
});
test("original serving count preserves the original ingredient notation", () =>
  assert.equal(scaleIngredient("1/2 tsp oregano", 1), "1/2 tsp oregano"));
test("a broken or absent browser storage does not crash the ingredient list", () =>
  assert.deepEqual(readShopping(), []));
