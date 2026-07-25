# Cursor Master Integration Prompt

You are the integration layer for the ecommerce-headless project (**Go Natural only**).

Your job is to integrate the latest **blog** automation patches from n8n into the REAL project architecture.

IMPORTANT:
- Files inside /automation are NOT rendered by the website.
- They are only generated patches.
- You must merge their content into the actual application structure.
- There is no Good Ideas / Buenos Productos brand. Do not create routes, libs, or i18n keys for it.

--------------------------------------------------
AUTOMATION SCOPE (n8n)
--------------------------------------------------

n8n is used ONLY for blog posts.

n8n does NOT load products or PDP data. Product catalog entries are added manually via Cursor (see PRODUCT MANUAL WORKFLOW below).

Read patches from:
- automation/generated-blog/go-natural/

Ignore for n8n integration (unless explicitly requested by the user):
- automation/generated-products/
- automation/generated-image-prompts/

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------

Go Natural Blog Routes:
- /{locale}/blog
- /{locale}/blog/{slug}

Rendering files:
- app/[locale]/blog/page.tsx
- app/[locale]/blog/[slug]/page.tsx

Shared blog components:
- components/blog/

Products (manual — not from n8n):
- lib/products.ts

Images metadata (manual):
- scripts/products/

Translations:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

--------------------------------------------------
MAIN TASK (n8n blog integration)
--------------------------------------------------

Read the latest generated file inside automation/generated-blog/go-natural/.

Integrate into the real i18n structure under path: blog.posts.{slug}

Never create:
- data/products
- data/blog
- anything under good-ideas / Good Ideas / Buenos Productos

--------------------------------------------------
BLOG RULES
--------------------------------------------------

Blog post shape (required for rendering):

```json
{
  "title": "...",
  "excerpt": "...",
  "subtitle": "...",
  "intro": "...",
  "heroImage": "/assets/images/...",
  "relatedProductIds": ["gn-example-001"],
  "sections": [
    {
      "heading": "...",
      "paragraphs": ["...", "..."],
      "image": "/assets/images/..."
    }
  ],
  "closing": "..."
}
```

Minimum required: title, excerpt.
Do NOT use raw HTML in a `content` field — convert to sections[].paragraphs[].

Merge blog post into:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

Path: blog.posts.{slug}

Cross-sell: relatedProductIds must use Go Natural product IDs from lib/products.ts only.

--------------------------------------------------
PRODUCT MANUAL WORKFLOW (Cursor — not n8n)
--------------------------------------------------

When the user asks to add a product to the catalog:

- insert productObject into lib/products.ts
- create/update scripts/products/{id}.json
- add images under public/assets/images/products/{id}/
- map categories in lib/categories.ts (PRODUCT_CATEGORY_MAP)

Product type fields: id, title, price, category, images[], description (+ optional slug, features, variants, translations).

PDP route (do not modify):
- /{locale}/products/{id}

--------------------------------------------------
STRICT RULES
--------------------------------------------------

- Do NOT redesign components
- Do NOT modify routes
- Do NOT break TypeScript
- Do NOT delete existing products or posts
- Do NOT overwrite unrelated content
- Preserve formatting consistency
- Preserve i18n structure
- Preserve existing IDs
- Do NOT reintroduce Good Ideas / good-ideas / Buenos Productos

--------------------------------------------------
FINAL TASKS
--------------------------------------------------

After integrating:

1. Confirm blog post appears under messages/*/blog.posts.{slug}
2. Confirm relatedProductIds resolve in lib/products.ts
3. Confirm TypeScript still typechecks
4. Summarize files changed
