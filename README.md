# recipe-book

Efren's living recipe book and pantry — designed to be read and updated by AI cooking assistants ('chef') and synced with recipes from Meta Muse and Instagram saves.

## Structure

- **`pantry.md`**: Living inventory split into Pantry / Fridge / Freezer with last updated date
- **`recipes/`**: One Markdown file per recipe with YAML frontmatter and structured sections
- **`ideas/`**: Chef-generated recipe variations linked to base recipes
- **`grocery-lists/`**: Dated shopping lists

## Format

Recipes use simple Markdown with YAML frontmatter for metadata (title, source, servings, times, tags, dietary info). All recipes are egg-free or include egg-free substitutions, as Efren does not eat eggs.

See **`AGENTS.md`** for detailed conventions that agents should follow when adding or modifying recipes.

## Examples

- `recipes/chicken-tinga.md` — Mexican shredded chicken in chipotle-tomato sauce
- `recipes/sopa-de-lentejas.md` — Hearty lentil soup

## Personal cookbook website

The Astro + React + TypeScript website lives in [`website/`](website/README.md). Run it with Node 24:

```sh
cd website
npm install
npm run dev
```

The website reads these Markdown recipes at build time. See its README for optional editorial fields, cooking tools, and private hosting details.
