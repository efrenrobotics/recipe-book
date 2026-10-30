# Efren’s Kitchen

An editorial cookbook built with Astro, React, TypeScript, and Tailwind CSS. Static pages carry the content; React islands power the index, ingredient tools, menus, and shopping list. Fonts and optimized photographs are hosted locally.

## Run

```sh
cd website
nvm use
npm install
npm run dev
```

`npm run check` checks Astro and TypeScript. `npm test` exercises quantity scaling. `npm run build` generates the static site in `dist/`. `npm run preview` serves that build.

## Content

Edit recipes in the repository’s top-level `recipes/` directory. `scripts/sync-content.mjs` copies Markdown into `content/recipes/` before development and builds, so the website can also be built as a standalone hosted project. The repository recipes remain authoritative. Restart the dev server after editing source recipes.

Frontmatter follows the repository template. Optional fields: `collections`, `dietary_tags`, `image`, `method`, `difficulty`, `status`, `times_made`, `first_made`, `last_made`, and `rating`. Recipe numbers are assigned from curated order followed by title order. No cooking history is fabricated.

Complete recipes need serving counts, multiple ingredients, and multiple instructions. Incomplete saved posts are visibly labeled source notes and link to their creator. Seven new `source: chef` recipes are explicitly marked kitchen drafts. They are starting proposals, not claims about Efren’s cooking history. Dietary tags are explicit, never inferred from incomplete posts.

## Interactions

- Index search covers titles, tags, and ingredients; category and dietary filters combine.
- Ingredient quantities support whole numbers, decimals, fractions, mixed fractions, and ranges. Explicit alternatives beginning with “or” also scale. Cooking times are not scaled.
- Ingredient checklists are per page. Shopping lists and one custom menu persist in localStorage on the current device; they do not sync across devices.
- Cook mode uses a native modal dialog, keyboard focus containment, Escape to close, an optional timer, and screen wake lock where supported. Wake lock is released on exit and reacquired on return to a visible tab.
- The menu’s asado timeline is editorial. Custom selections receive a rough longest-first schedule; equipment conflicts and resting times require cook judgment.

## Images

`public/images/` contains optimized, AI-generated illustrative food photographs. They are disclosed on recipe pages and the About page. See `IMAGE-PROMPTS.md` for the creation prompts.

## Publication

This website is local-only at Efren’s request. No source or recipe content was uploaded or published. `.openai/hosting.json` retains the reserved, unpublished Sites identity for a future deployment only if explicitly authorized. Do not publish automatically.
