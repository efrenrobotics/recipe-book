import { useState, useEffect, useRef } from "react";
import type { Recipe } from "../lib/recipes";
import { scaleIngredient, readShopping, SHOP_KEY } from "../lib/quantities";
export default function CookingTools({ recipe: r }: { recipe: Recipe }) {
  const [servings, setServings] = useState(r.servings),
    [checked, setChecked] = useState<number[]>([]),
    [status, setStatus] = useState(""),
    [cook, setCook] = useState(false),
    [step, setStep] = useState(0),
    [seconds, setSeconds] = useState<number | null>(null),
    [wakeMessage, setWakeMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const ingredients = r.ingredients.map((x) =>
    scaleIngredient(x, servings / r.servings),
  );
  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    const id = setTimeout(
      () => setSeconds((s) => (s === null ? null : s - 1)),
      1000,
    );
    return () => clearTimeout(id);
  }, [seconds]);
  useEffect(() => {
    if (!cook) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        if ("wakeLock" in navigator) {
          const value = await navigator.wakeLock.request("screen");
          if (cancelled) await value.release();
          else {
            lock = value;
            setWakeMessage("Screen stays awake while this view is active.");
          }
        } else
          setWakeMessage("Screen wake lock is unavailable in this browser.");
      } catch {
        setWakeMessage("Keep your screen awake using your device settings.");
      }
    };
    void request();
    const onVisible = () => {
      if (document.visibilityState === "visible") void request();
    };
    document.addEventListener("visibilitychange", onVisible);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelled = true;
      void lock?.release();
      document.removeEventListener("visibilitychange", onVisible);
      document.body.style.overflow = before;
    };
  }, [cook]);
  function openCook() {
    setStep(0);
    setSeconds(null);
    setCook(true);
    dialog.current?.showModal();
  }
  function closeCook() {
    dialog.current?.close();
    setCook(false);
    setSeconds(null);
    trigger.current?.focus();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${r.title} · ${servings} servings\n${ingredients.join("\n")}`,
      );
      setStatus("Ingredients copied.");
    } catch {
      setStatus("Copy unavailable. Select the ingredient text to copy it.");
    }
  }
  function add() {
    try {
      const items = readShopping();
      ingredients.forEach((text, i) => {
        const id = `${r.slug}-${servings}-${i}`;
        if (!items.some((x) => x.id === id))
          items.push({
            id,
            text,
            recipe: `${r.title} · ${servings} servings`,
            checked: false,
          });
      });
      localStorage.setItem(SHOP_KEY, JSON.stringify(items));
      setStatus("Added to your shopping list. Saved on this device.");
    } catch {
      setStatus("Storage is unavailable. Copy the ingredients instead.");
    }
  }
  const relevant = ingredients.filter((_, i) =>
    r.ingredients[i]
      .replace(/^[\d\s./–-]+/, "")
      .replace(/^(cups?|tbsp|tsp|kg|g|ml|cloves?|ears?)\s+/, "")
      .split(/[ ,]+/)
      .some(
        (word) =>
          word.length > 3 &&
          new RegExp(`\\b${word.replace(/[^a-z]/gi, "")}\\b`, "i").test(
            r.steps[step],
          ),
      ),
  );
  const timer = r.steps[step]?.match(/(\d+)(?:[–-]\d+)?\s*minutes?/i);
  return (
    <>
      <div className="recipe-toolbar">
        <button className="blue-button" ref={trigger} onClick={openCook}>
          Enter cook mode <span>↗</span>
        </button>
        <button className="text-link" onClick={() => window.print()}>
          Print recipe ↗
        </button>
        <a className="text-link" href="/shopping/">
          Shopping list ↗
        </a>
      </div>
      <div className="recipe-body">
        <section className="ingredients-section">
          <div className="eyebrow blue">GET EVERYTHING READY</div>
          <h2>Ingredients</h2>
          <div className="serving-control">
            <button
              aria-label="Decrease servings"
              disabled={servings <= 1}
              onClick={() => setServings((s) => s - 1)}
            >
              −
            </button>
            <span aria-live="polite">{servings} SERVINGS</span>
            <button
              aria-label="Increase servings"
              disabled={servings >= 48}
              onClick={() => setServings((s) => s + 1)}
            >
              +
            </button>
          </div>
          <ul className="ingredients">
            {ingredients.map((x, i) => (
              <li key={i}>
                <label className={checked.includes(i) ? "checked" : ""}>
                  <input
                    type="checkbox"
                    checked={checked.includes(i)}
                    onChange={() =>
                      setChecked((a) =>
                        a.includes(i) ? a.filter((n) => n !== i) : [...a, i],
                      )
                    }
                  />
                  <span>{x}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="ingredient-actions">
            <button onClick={copy}>Copy ingredients ↗</button>
            <button onClick={add}>Add to shopping list +</button>
          </div>
          <p className="status" role="status">
            {status}
          </p>
          <p className="small-note">
            Quantities scale; cooking time and pan size need your judgment.
          </p>
        </section>
        <section className="method-section">
          <div className="eyebrow blue">ONE THING AT A TIME</div>
          <h2>The method</h2>
          <ol className="method-list">
            {r.steps.map((s, i) => (
              <li key={i}>
                <span className="step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <dialog
        ref={dialog}
        aria-label={`Cook ${r.title}`}
        className="cook-dialog"
        onCancel={(e) => {
          e.preventDefault();
          closeCook();
        }}
        onClose={() => setCook(false)}
      >
        <div className="cook-top">
          <span>EFREN’S KITCHEN / COOK MODE</span>
          <button onClick={closeCook} aria-label="Close cook mode">
            CLOSE ×
          </button>
        </div>
        <div className="cook-content">
          <div className="eyebrow">
            {r.title} · {servings} SERVINGS
          </div>
          <span className="cook-counter">
            {String(step + 1).padStart(2, "0")}{" "}
            <span>/ {String(r.steps.length).padStart(2, "0")}</span>
          </span>
          <h2 key={step}>{r.steps[step]}</h2>
          <div className="step-quantities">
            <span className="eyebrow">
              {relevant.length ? "FOR THIS STEP" : "FOR THIS BATCH"}
            </span>
            <p>{(relevant.length ? relevant : ingredients).join(" · ")}</p>
          </div>
          <details>
            <summary>All ingredients for this batch ↓</summary>
            <ul>
              {ingredients.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </details>
          {timer && (
            <div className="timer">
              <button onClick={() => setSeconds(Number(timer[1]) * 60)}>
                Start {timer[1]} min timer ◷
              </button>
              {seconds !== null && (
                <>
                  <output aria-live={seconds === 0 ? "polite" : "off"}>
                    {seconds === 0
                      ? "Timer finished"
                      : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}
                  </output>
                  <button onClick={() => setSeconds(null)}>Cancel timer</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="cook-bottom">
          <button
            disabled={step === 0}
            onClick={() => {
              setStep((s) => s - 1);
              setSeconds(null);
            }}
          >
            ← PREVIOUS
          </button>
          <span className="wake-note">{wakeMessage}</span>
          <button
            className="blue-button"
            onClick={() => {
              if (step === r.steps.length - 1) closeCook();
              else {
                setStep((s) => s + 1);
                setSeconds(null);
              }
            }}
          >
            {step === r.steps.length - 1 ? "FINISH" : "NEXT STEP"} →
          </button>
        </div>
      </dialog>
    </>
  );
}
