import { useState, useEffect } from "react";
import type { Recipe } from "../lib/recipes";
import { scaleIngredient, readShopping, SHOP_KEY } from "../lib/quantities";
const initial = [
  "picanha-chimichurri",
  "chimichurri",
  "papas-nortenas",
  "elotes-con-limon",
];
const timeline = [
  [
    "T − 120",
    "Make the chimichurri.",
    "Chop the herbs, stir, and let the flavors settle.",
  ],
  [
    "T − 60",
    "Get the potatoes going.",
    "Heat the oven and put the potatoes in to roast.",
  ],
  [
    "T − 40",
    "Light the charcoal.",
    "Prepare a hot side and a cooler side. Set the table.",
  ],
  [
    "T − 25",
    "Start the corn.",
    "Turn it as it chars. Keep the finished ears warm.",
  ],
  [
    "T − 20",
    "Grill the picaña.",
    "Sear, then move to indirect heat. Use a thermometer.",
  ],
  [
    "T − 00",
    "Rest, slice, pass it around.",
    "Let the meat rest. Bring everything to the table.",
  ],
];
export default function MenuPlanner({ recipes }: { recipes: Recipe[] }) {
  const [guests, setGuests] = useState(8),
    [selected, setSelected] = useState(initial),
    [name, setName] = useState("Asado"),
    [status, setStatus] = useState("");
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("efren-menu-v1") || "null");
      if (
        s &&
        Array.isArray(s.selected) &&
        Number.isInteger(s.guests) &&
        s.guests > 0 &&
        s.guests <= 24
      ) {
        setSelected(
          s.selected.filter((slug: string) =>
            recipes.some((r) => r.slug === slug),
          ),
        );
        setGuests(s.guests);
        if (typeof s.name === "string") setName(s.name);
      }
    } catch {}
  }, []);
  const chosen = selected
    .map((slug) => recipes.find((r) => r.slug === slug))
    .filter((r): r is Recipe => !!r);
  const isAsado = initial.every((s) => selected.includes(s));
  function save() {
    try {
      localStorage.setItem(
        "efren-menu-v1",
        JSON.stringify({ guests, selected, name }),
      );
      setStatus("Menu saved on this device.");
    } catch {
      setStatus(
        "Storage unavailable. Keep this page open to retain your menu.",
      );
    }
  }
  function shop() {
    try {
      const items = readShopping();
      chosen.forEach((r) =>
        r.ingredients.forEach((text, i) => {
          if (
            r.slug === "picanha-chimichurri" &&
            text.includes("chimichurri") &&
            selected.includes("chimichurri")
          )
            return;
          const id = `${r.slug}-${guests}-${i}`;
          if (!items.some((x) => x.id === id))
            items.push({
              id,
              text: scaleIngredient(text, guests / r.servings),
              recipe: `${r.title} · ${guests} servings`,
              checked: false,
            });
        }),
      );
      localStorage.setItem(SHOP_KEY, JSON.stringify(items));
      setStatus("Menu ingredients added to your shopping list.");
    } catch {
      setStatus("Shopping list storage unavailable.");
    }
  }
  return (
    <>
      <div className="menu-layout">
        <section className="menu-paper">
          <div className="eyebrow">THE TABLE IS SET</div>
          <h2>
            {name || "Dinner"}
            <br />
            <i>for {guests}.</i>
          </h2>
          <div className="serving-control">
            <button
              disabled={guests <= 1}
              aria-label="Fewer guests"
              onClick={() => setGuests((g) => g - 1)}
            >
              −
            </button>
            <span>{guests} AT THE TABLE</span>
            <button
              disabled={guests >= 24}
              aria-label="More guests"
              onClick={() => setGuests((g) => g + 1)}
            >
              +
            </button>
          </div>
          <ul>
            {chosen.map((r) => (
              <li key={r.slug}>
                <a href={`/recipes/${r.slug}/`}>{r.title} ↗</a>
              </li>
            ))}
          </ul>
          <p className="menu-note">A loose plan for a long afternoon.</p>
        </section>
        <section className="menu-plan">
          <span className="eyebrow blue">
            A LITTLE PLANNING GOES A LONG WAY
          </span>
          <h2>The order of things.</h2>
          <p className="small-note">
            Approximate timings before serving. Heat, portions, and equipment
            will change the pace.
          </p>
          {isAsado ? (
            <ol className="timeline">
              {timeline.map(([time, title, detail]) => (
                <li key={time}>
                  <span>{time}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="timeline">
              {[...chosen]
                .sort(
                  (a, b) => b.prepTime + b.cookTime - (a.prepTime + a.cookTime),
                )
                .map((r) => (
                  <li key={r.slug}>
                    <span>
                      {r.timeKnown
                        ? `T − ${r.prepTime + r.cookTime}`
                        : "TIME TBD"}
                    </span>
                    <div>
                      <h3>Start {r.title.toLowerCase()}.</h3>
                      <p>
                        {r.timeKnown
                          ? `Allow ${r.prepTime} minutes to prep and ${r.cookTime} minutes to cook. Check the recipe for resting time.`
                          : "Timing was not recorded. Review the recipe and plan before serving."}
                      </p>
                    </div>
                  </li>
                ))}
            </ol>
          )}
        </section>
      </div>
      <section className="menu-builder">
        <div>
          <span className="eyebrow blue">MAKE IT YOUR TABLE</span>
          <h2>Change the menu.</h2>
          <label className="menu-name">
            MENU NAME
            <input
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <div className="menu-choices">
            {recipes.map((r) => (
              <label key={r.slug}>
                <input
                  type="checkbox"
                  checked={selected.includes(r.slug)}
                  onChange={() =>
                    setSelected((s) =>
                      s.includes(r.slug)
                        ? s.filter((x) => x !== r.slug)
                        : [...s, r.slug],
                    )
                  }
                />
                {r.title}
              </label>
            ))}
          </div>
          <div className="menu-actions">
            <button className="blue-button" onClick={save}>
              Save menu ↗
            </button>
            <button
              className="text-link"
              disabled={!selected.length}
              onClick={shop}
            >
              Add menu to shopping list +
            </button>
            <a className="text-link" href="/shopping/">
              View list ↗
            </a>
          </div>
          <p className="status" role="status">
            {status}
          </p>
        </div>
      </section>
    </>
  );
}
