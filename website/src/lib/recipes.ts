import { parse } from "yaml";
export type Recipe = {
  slug: string;
  title: string;
  number: string;
  description: string;
  ingredients: string[];
  steps: string[];
  notes: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  timeKnown: boolean;
  tags: string[];
  dietaryTags: string[];
  collections: string[];
  image: string;
  method: string;
  difficulty: string;
  complete: boolean;
  draft: boolean;
  source: string;
  sourceUrl: string | null;
  creator: string;
  containsEggs: boolean;
  firstMade?: string;
  lastMade?: string;
  timesMade?: number;
  rating?: number;
};
const files = import.meta.glob("../../content/recipes/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const preferred = [
  "picanha-chimichurri",
  "chicken-tinga",
  "papas-nortenas",
  "elotes-con-limon",
  "chimichurri",
  "arepas-de-maiz",
  "sopa-de-lentejas",
  "vanilla-honey-latte",
  "espresso-house-recipe",
];
const images: Record<string, string> = {
  "picanha-chimichurri": "/images/picanha.webp",
  "papas-nortenas": "/images/potatoes.webp",
  "vanilla-honey-latte": "/images/coffee.webp",
  "espresso-house-recipe": "/images/coffee.webp",
};
function section(body: string, name: string) {
  return (
    body
      .split(new RegExp(`^## ${name}\\s*$`, "m"))[1]
      ?.split(/^## /m)[0]
      ?.trim() || ""
  );
}
export const recipes: Recipe[] = Object.entries(files)
  .map(([path, raw]) => {
    const parts = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!parts) throw new Error(`Invalid frontmatter: ${path}`);
    const data = parse(parts[1]);
    const content = parts[2];
    const slug = path.split("/").pop()!.replace(".md", "");
    const ingredients = section(content, "Ingredients")
      .split("\n")
      .filter((x) => x.startsWith("- "))
      .map((x) => x.slice(2));
    const steps = section(content, "Steps")
      .split("\n")
      .filter((x) => /^\d+\. /.test(x))
      .map((x) => x.replace(/^\d+\. /, ""));
    const notes = section(content, "Notes")
      .split("\n")
      .filter(Boolean)
      .map((x) => x.replace(/^- /, ""));
    const complete =
      !!data.servings &&
      ingredients.length > 1 &&
      steps.length > 1 &&
      !steps.some((x) => x.includes("Full instructions are"));
    const tags: string[] = data.tags || [];
    const collections: string[] = data.collections || [
      ...(tags.includes("mexican") ? ["mexican"] : []),
      ...(tags.includes("chicken") ? ["weekday"] : []),
    ];
    return {
      slug,
      title: String(data.title),
      number: "",
      description: content
        .replace(/^# .+\n/m, "")
        .split("## ")[0]
        .trim(),
      ingredients,
      steps,
      notes,
      servings: Number(data.servings) || 4,
      prepTime: parseInt(data.prep_time) || 0,
      cookTime: parseInt(data.cook_time) || 0,
      timeKnown: !!data.prep_time && !!data.cook_time,
      tags,
      dietaryTags: data.dietary_tags || [],
      collections,
      image: data.image || images[slug] || "",
      method: data.method || "Home kitchen",
      difficulty: data.difficulty || "Everyday",
      complete,
      draft: data.status === "draft",
      source: data.source || "manual",
      sourceUrl: data.source_url || null,
      creator: data.creator || "",
      containsEggs: !!data.contains_eggs,
      firstMade: data.first_made,
      lastMade: data.last_made,
      timesMade: data.times_made,
      rating: data.rating,
    };
  })
  .sort((a, b) => {
    const ai = preferred.indexOf(a.slug),
      bi = preferred.indexOf(b.slug);
    return (
      (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) ||
      a.title.localeCompare(b.title)
    );
  })
  .map((r, i) => ({ ...r, number: String(i + 1).padStart(3, "0") }));
export const getRecipe = (slug: string) =>
  recipes.find((r) => r.slug === slug)!;
export const chapters = [
  {
    slug: "asado",
    title: "Asado",
    description: "Fire, something cold, and enough food for everyone.",
    number: "01",
  },
  {
    slug: "weekday",
    title: "The everyday table",
    description: "Good food, even when there isn’t much time.",
    number: "02",
  },
  {
    slug: "mexican",
    title: "A little closer to home",
    description: "Chiles, corn, lime. Familiar things, made your own.",
    number: "03",
  },
  {
    slug: "venezuelan",
    title: "Venezuela, at the table",
    description: "Start with an arepa. Make room for more.",
    number: "04",
  },
  {
    slug: "for-six",
    title: "Pull up a chair",
    description: "For six, for eight, for whoever stays for dinner.",
    number: "05",
  },
  {
    slug: "summer",
    title: "Long summer evenings",
    description: "A hot grill and no reason to hurry.",
    number: "06",
  },
  {
    slug: "breakfast",
    title: "An unhurried morning",
    description: "Something warm before the day begins.",
    number: "07",
  },
  {
    slug: "coffee",
    title: "One more cup",
    description: "Ratios, rituals, and small adjustments.",
    number: "08",
  },
];
