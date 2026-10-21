# Agent Conventions for Efren's Recipe Book

This document defines the structure and conventions for AI agents (including Muse, chef, and others) to correctly read from and write to this recipe repository.

## Repository Structure

```
/
├── pantry.md              # Living inventory (Pantry / Fridge / Freezer)
├── recipes/               # One file per recipe
│   ├── _TEMPLATE.md       # Template for new recipes
│   └── *.md               # Individual recipe files
├── ideas/                 # Chef-generated variations
├── grocery-lists/         # Dated shopping lists
├── AGENTS.md              # This file
└── README.md              # Human-readable overview
```

## Dietary Rules

**Efren does not eat eggs.**

- All recipes must be egg-free or include egg-free substitutions.
- Set `contains_eggs: true` in frontmatter for recipes that traditionally contain eggs.
- When suggesting recipes with eggs, provide explicit egg-free swaps.

## Recipe Format

Each recipe is a Markdown file (`recipes/recipe-name.md`) with YAML frontmatter and structured sections.

### YAML Frontmatter (Required)

```yaml
---
title: Recipe Name
source: muse|instagram|chef|manual     # Origin of the recipe
source_url: https://example.com        # Original URL (or null)
creator: Author Name                   # Original creator/chef
servings: 4                            # Number as integer
prep_time: 15 min                      # String with unit
cook_time: 30 min                      # String with unit
tags:                                  # Array of relevant tags
  - cuisine-type
  - protein
  - method
contains_eggs: false                   # Boolean, default false
date_added: 2026-10-21                 # Date in YYYY-MM-DD format
---
```

### Required Sections

1. **Title** (H1): Recipe name
2. **Ingredients**: Bulleted list with quantities and units (for scaling)
   - Format: `- 2 cups flour`
   - Use standard units: cups, tbsp, tsp, kg, g, oz, lb
3. **Steps**: Numbered list with clear instructions
   - Format: `1. Do this step.`

### Optional Sections

- Brief description paragraph after title
- **Notes**: Tips, substitutions, storage, variations

### Naming Convention

- Filenames: lowercase, hyphenated, descriptive
- Examples: `chicken-tinga.md`, `lentil-soup.md`, `pasta-arrabbiata.md`

## Ideas Format (Chef Variations)

Files in `ideas/` follow the same recipe format with an additional frontmatter field:

```yaml
base_recipe: recipes/original-recipe.md
```

This links variations back to their source recipe.

## Pantry Format

`pantry.md` contains three H2 sections:
- `## Pantry`
- `## Fridge`
- `## Freezer`

Each section lists items as a bulleted list or comma-separated paragraph. Include a "Last updated" date at the top.

## Grocery Lists

Files in `grocery-lists/` are named by date: `YYYY-MM-DD.md` (e.g., `2026-10-21.md`). Format is flexible — use sections, bullets, or free text.

## Adding Recipes

When adding a recipe (from Muse, Instagram saves, or elsewhere):

1. Create a new file in `recipes/` with a descriptive hyphenated name
2. Use `recipes/_TEMPLATE.md` as the starting structure
3. Fill in all required frontmatter fields
4. Set `source` to `muse`, `instagram`, `chef`, or `manual`
5. Include `source_url` if available
6. Set `contains_eggs: true` if the recipe has eggs; add egg-free swaps in Notes
7. Use clear quantities with units in Ingredients
8. Write concise, actionable Steps

## Modifying Pantry

When updating `pantry.md`:
1. Reflect current inventory across Pantry / Fridge / Freezer sections
2. Update the "Last updated" date
3. Use simple bulleted lists or comma-separated text

## Tags

Use consistent, lowercase tags for easier filtering:
- Cuisine: `mexican`, `italian`, `asian`, `american`
- Protein: `chicken`, `beef`, `pork`, `fish`, `vegetarian`, `vegan`
- Method: `slow-cooker`, `sheet-pan`, `one-pot`, `batch-cooking`
- Meal type: `breakfast`, `lunch`, `dinner`, `snack`, `dessert`
- Special: `quick`, `make-ahead`, `freezer-friendly`, `healthy`

## Example Recipe

See `recipes/chicken-tinga.md` or `recipes/sopa-de-lentejas.md` for complete examples.

---

**Questions or issues?** This is a living document. Update conventions here as the system evolves.
