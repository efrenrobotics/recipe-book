import { useEffect, useState } from "react";
import type { Recipe } from "../lib/recipes";
const filters = [
  "All",
  "Meat",
  "Chicken",
  "Seafood",
  "Sides",
  "Rice",
  "Pasta",
  "Breakfast",
  "Dessert",
  "Coffee",
  "Grill",
  "Quick",
  "Dinner party",
];
function matches(r: Recipe, f: string) {
  const s = f.toLowerCase().replaceAll(" ", "-");
  return (
    f === "All" ||
    r.tags.includes(s) ||
    (f === "Meat" && r.tags.some((t) => ["beef", "pork"].includes(t))) ||
    (f === "Seafood" &&
      r.tags.some((t) => ["fish", "salmon", "seafood"].includes(t))) ||
    (f === "Rice" && /rice|arroz/i.test(r.title)) ||
    (f === "Pasta" && /pasta|rigatoni|lasagna/i.test(r.title)) ||
    (f === "Quick" &&
      r.complete &&
      r.timeKnown &&
      r.prepTime + r.cookTime <= 30)
  );
}
export default function RecipeIndex({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [diet, setDiet] = useState<string[]>([]),
    [view, setView] = useState("index"),
    [complete, setComplete] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).has("search"))
      document.getElementById("recipe-search")?.focus();
  }, []);
  const filtered = recipes.filter(
    (r) =>
      matches(r, filter) &&
      (!complete || r.complete) &&
      diet.every((d) => r.dietaryTags.includes(d)) &&
      `${r.title} ${r.tags.join(" ")} ${r.ingredients.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="index-search">
        <label htmlFor="recipe-search">FIND SOMETHING GOOD</label>
        <div>
          <input
            id="recipe-search"
            type="search"
            placeholder="A recipe, an ingredient, a craving…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span aria-hidden="true">↗</span>
        </div>
      </div>
      <div className="filter-bar" aria-label="Recipe categories">
        {filters.map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="index-options">
        <div className="diet-filters">
          {["gluten-free", "dairy-free"].map((d) => (
            <label key={d}>
              <input
                type="checkbox"
                checked={diet.includes(d)}
                onChange={() =>
                  setDiet((a) =>
                    a.includes(d) ? a.filter((x) => x !== d) : [...a, d],
                  )
                }
              />
              {d.replace("-", " ")}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              checked={complete}
              onChange={(e) => setComplete(e.target.checked)}
            />
            Ready to cook
          </label>
        </div>
        <div className="view-switch">
          <button
            aria-pressed={view === "index"}
            onClick={() => setView("index")}
          >
            ☷ Index view
          </button>
          <button
            aria-pressed={view === "image"}
            onClick={() => setView("image")}
          >
            ⊞ Image view
          </button>
        </div>
      </div>
      <div className="result-count" aria-live="polite">
        {filtered.length} ENTRIES{" "}
        <span>DIETARY LABELS SHOWN ONLY WHEN VERIFIED IN RECIPE DATA</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>Nothing here. Yet.</h2>
          <p>Try another ingredient, or open up the filters.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilter("All");
              setDiet([]);
              setComplete(false);
            }}
          >
            Reset filters ↗
          </button>
        </div>
      ) : view === "index" ? (
        <div className="recipe-table">
          <div className="table-head">
            <span>NO.</span>
            <span>RECIPE</span>
            <span>FROM THE KITCHEN</span>
            <span>TIME</span>
            <span />
          </div>
          {filtered.map((r) => (
            <a key={r.slug} href={`/recipes/${r.slug}/`} className="recipe-row">
              <span className="row-number">{r.number}</span>
              <span className="row-title">
                {r.title}
                {!r.complete && <small>SOURCE NOTE</small>}
              </span>
              <span className="row-category">
                {r.tags[0]?.replaceAll("-", " ") || "Collected"}
              </span>
              <span className="row-time">
                {r.complete && r.timeKnown
                  ? `${r.prepTime + r.cookTime} min`
                  : "—"}
              </span>
              <span className="row-arrow">↗</span>
            </a>
          ))}
        </div>
      ) : (
        <div className="index-image-grid">
          {filtered.map((r) => (
            <a href={`/recipes/${r.slug}/`} key={r.slug}>
              {r.image ? (
                <img
                  src={r.image}
                  alt={r.title}
                  width="600"
                  height="450"
                  loading="lazy"
                />
              ) : (
                <div className="index-type-image">
                  <span>{r.number}</span>
                  <i>{r.title}</i>
                </div>
              )}
              <div className="card-meta">
                <span>RECIPE {r.number}</span>
                <span>
                  {r.complete && r.timeKnown
                    ? `${r.prepTime + r.cookTime} MIN`
                    : r.complete
                      ? "TIME NOT RECORDED"
                      : "SOURCE NOTE"}
                </span>
              </div>
              <h3>{r.title}</h3>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
