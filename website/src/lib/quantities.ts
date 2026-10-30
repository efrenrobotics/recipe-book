const fraction = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .reduce(
      (sum, p) =>
        sum +
        (p.includes("/")
          ? Number(p.split("/")[0]) / Number(p.split("/")[1])
          : Number(p)),
      0,
    );
export function formatQuantity(n: number) {
  return Number(n.toFixed(2)).toString();
}
export function scaleIngredient(line: string, ratio: number) {
  if (ratio === 1) return line;
  const scaled = line.replace(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(?:\s*[-–]\s*(\d+(?:\.\d+)?))?/,
    (_, a, b) =>
      formatQuantity(fraction(a) * ratio) +
      (b ? "–" + formatQuantity(fraction(b) * ratio) : ""),
  );
  return scaled.replace(
    /(\bor\s+)(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/g,
    (_, prefix, amount) => prefix + formatQuantity(fraction(amount) * ratio),
  );
}
export type ShoppingItem = {
  id: string;
  text: string;
  recipe: string;
  checked: boolean;
};
export const SHOP_KEY = "efren-shopping-v1";
export function readShopping(): ShoppingItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(SHOP_KEY) || "[]");
    return Array.isArray(v)
      ? v.filter(
          (x) =>
            x &&
            typeof x.id === "string" &&
            typeof x.text === "string" &&
            typeof x.recipe === "string" &&
            typeof x.checked === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}
