# Cursor Master Integration Prompt

You are the integration layer for the ecommerce-headless project.

Your job is to integrate the latest generated automation patches into the REAL project architecture.

IMPORTANT:
- Files inside /automation are NOT rendered by the website.
- They are only generated patches.
- You must merge their content into the actual application structure.

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------

Go Natural Blog Routes:
- /{locale}/blog
- /{locale}/blog/{slug}

Good Ideas Blog Routes:
- /{locale}/good-ideas/blog
- /{locale}/good-ideas/blog/{slug}

Rendering files:
- app/[locale]/blog/page.tsx
- app/[locale]/blog/[slug]/page.tsx
- app/[locale]/good-ideas/blog/page.tsx
- app/[locale]/good-ideas/blog/[slug]/page.tsx

Shared blog components:
- components/blog/

Products architecture:
- lib/products.ts
- lib/good-ideas-products.ts

Images metadata:
- scripts/products/
- scripts/good-ideas-products/

Translations:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

--------------------------------------------------
MAIN TASK
--------------------------------------------------

Read the latest generated files inside:

- automation/generated-products/
- automation/generated-blog/
- automation/generated-image-prompts/

Then integrate them into the REAL project architecture.

--------------------------------------------------
PRODUCT RULES
--------------------------------------------------

If brand is "Go Natural":
- integrate productObject into lib/products.ts
- create/update scripts/products/{id}.json

If brand is "Good Ideas":
- integrate productObject into lib/good-ideas-products.ts
- create/update scripts/good-ideas-products/{id}.json

Never create:
- data/products
- data/blog

--------------------------------------------------
BLOG RULES
--------------------------------------------------

If brand is "Go Natural":
merge blog post into:
messages/en.json
messages/es.json
messages/fr.json
messages/it.json

Path:
blog.posts.{slug}

If brand is "Good Ideas":
merge blog post into:
messages/en.json
messages/es.json
messages/fr.json
messages/it.json

Path:
goodIdeas.blog.posts.{slug}

--------------------------------------------------
IMAGE PROMPT RULES
--------------------------------------------------

Read latest generated image prompt patch.

If images metadata file already exists:
- merge prompts safely
- preserve existing fields

If it does not exist:
- create it

--------------------------------------------------
STRICT RULES
--------------------------------------------------

- Do NOT redesign components
- Do NOT modify routes
- Do NOT break TypeScript
- Do NOT delete existing products
- Do NOT overwrite unrelated content
- Preserve formatting consistency
- Preserve i18n structure
- Preserve existing IDs

--------------------------------------------------
FINAL TASKS
--------------------------------------------------

After integration:

1. Run:
npm run build

2. Fix all build/type/json errors automatically

3. Prepare git commands:
git add .
git commit -m "Integrate generated automation patches"
git push

4. Output a summary of:
- products integrated
- blog posts integrated
- image prompt files created
- modified files
