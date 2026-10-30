import { useState, useEffect } from "react";
import { readShopping, SHOP_KEY, type ShoppingItem } from "../lib/quantities";
export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]),
    [ready, setReady] = useState(false),
    [status, setStatus] = useState("");
  useEffect(() => {
    setItems(readShopping());
    setReady(true);
  }, []);
  function update(next: ShoppingItem[]) {
    setItems(next);
    try {
      localStorage.setItem(SHOP_KEY, JSON.stringify(next));
    } catch {
      setStatus("Changes could not be saved on this device.");
    }
  }
  return (
    <div className="shopping-content">
      <p className="intro-copy">
        One less thing to remember. Your list stays on this device.
      </p>
      {!ready ? (
        <p>Opening your list…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h2>A clean slate.</h2>
          <p>Add ingredients from any complete recipe to start your list.</p>
          <a className="text-link" href="/recipes/">
            Find something to cook ↗
          </a>
        </div>
      ) : (
        <>
          <div className="shopping-toolbar">
            <span>
              {items.filter((i) => !i.checked).length} LEFT TO PICK UP
            </span>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    items
                      .filter((i) => !i.checked)
                      .map((i) => i.text)
                      .join("\n"),
                  );
                  setStatus("Unchecked ingredients copied.");
                } catch {
                  setStatus("Copy unavailable in this browser.");
                }
              }}
            >
              Copy list ↗
            </button>
            <button onClick={() => update(items.filter((i) => !i.checked))}>
              Clear checked
            </button>
          </div>
          {[...new Set(items.map((i) => i.recipe))].map((recipe) => (
            <section key={recipe}>
              <h2>{recipe}</h2>
              <ul className="ingredients">
                {items
                  .filter((i) => i.recipe === recipe)
                  .map((item) => (
                    <li key={item.id}>
                      <label className={item.checked ? "checked" : ""}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() =>
                            update(
                              items.map((i) =>
                                i.id === item.id
                                  ? { ...i, checked: !i.checked }
                                  : i,
                              ),
                            )
                          }
                        />
                        <span>{item.text}</span>
                      </label>
                      <button
                        className="remove-item"
                        aria-label={`Remove ${item.text}`}
                        onClick={() =>
                          update(items.filter((i) => i.id !== item.id))
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </>
      )}
      <p className="status" role="status">
        {status}
      </p>
    </div>
  );
}
