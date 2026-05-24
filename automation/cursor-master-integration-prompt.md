# Cursor Master Integration Prompt

You are the integration layer for the ecommerce-headless project.

Your job is to integrate the latest **blog** automation patches from n8n into the REAL project architecture.

IMPORTANT:
- Files inside /automation are NOT rendered by the website.
- They are only generated patches.
- You must merge their content into the actual application structure.

--------------------------------------------------
AUTOMATION SCOPE (n8n)
--------------------------------------------------

n8n is used ONLY for blog posts.

n8n does NOT load products or PDP data. Product catalog entries are added manually via Cursor (see PRODUCT MANUAL WORKFLOW below).

Read patches from:
- automation/generated-blog/

Ignore for n8n integration (unless explicitly requested by the user):
- automation/generated-products/
- automation/generated-image-prompts/

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

Products (manual — not from n8n):
- lib/products.ts (Go Natural)
- lib/good-ideas-products.ts (Good Ideas)

Images metadata (manual):
- scripts/products/
- scripts/good-ideas-products/

Translations:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

--------------------------------------------------
MAIN TASK (n8n blog integration)
--------------------------------------------------

Read the latest generated file inside automation/generated-blog/ (check go-natural/ and good-ideas/ subfolders).

Detect brand from patch metadata or folder path, then integrate into the real i18n structure.

Never create:
- data/products
- data/blog

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
  "relatedProductIds": ["gi-tech-001"],
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

If brand is "Go Natural":
merge blog post into:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

Path: blog.posts.{slug}

If brand is "Good Ideas":
merge blog post into:
- messages/en.json
- messages/es.json
- messages/fr.json
- messages/it.json

Path: goodIdeas.blog.posts.{slug}

Good Ideas cross-sell: relatedProductIds must use gi-* IDs from lib/good-ideas-products.ts only (never getProducts / Go Natural IDs).

--------------------------------------------------
PRODUCT MANUAL WORKFLOW (Cursor — not n8n)
--------------------------------------------------

When the user asks to add a product to the catalog:

If brand is "Go Natural":
- insert productObject into lib/products.ts
- create/update scripts/products/{id}.json
- add images under public/assets/images/products/{id}/

If brand is "Good Ideas":
- insert productObject into lib/good-ideas-products.ts
- create/update scripts/good-ideas-products/{id}.json
- add images under public/assets/images/good-ideas-products/{id}/

Product type fields: id, title, price, category, images[], description (+ optional slug, features, variants, translations).

PDP routes (do not modify):
- Go Natural: /{locale}/products/{id}
- Good Ideas: /{locale}/good-ideas/products/{id}

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
- blog posts integrated (n8n)
- products integrated (manual, if any)
- modified files
