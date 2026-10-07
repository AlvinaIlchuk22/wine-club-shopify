# Marlow Vale: Shopify theme (concept)

A custom **Online Store 2.0** theme built from the Marlow Vale winery concept site: a full-screen wine carousel, product cards that add to the real cart, a wine-club landing page with a membership form, and a cellar-door section. Plain Liquid, CSS and JavaScript (GSAP is bundled in `assets/`).

Marlow Vale Estate is a fictional winery, so all copy and images are samples.

## What is in it
| Page / template | Sections |
|---|---|
| Home (`templates/index.json`) | `wine-carousel`, `stats`, `featured-wines`, `story`, `cellar-door`, `quote` |
| Club landing (`templates/page.club.json`) | `club-hero`, `club-tiers`, `club-steps`, `faq`, `club-join` |
| Product, collection, cart, page, 404, password | `main-product`, `main-collection`, `main-cart`, `main-page`, `main-404` |

Everything is editable in the theme editor (headings, text, photos, colours, products). Wine blocks can be linked to real products: the carousel and cards then use the product's name, price, first image and the Add to cart form. Until a product is picked they show sample content.

## Install
1. **Zip:** Online Store > Themes > Add theme > Upload zip, and choose `marlow-vale-theme.zip`.
2. **GitHub:** connect this repository from Online Store > Themes > Add theme > Connect from GitHub.
3. **CLI:** `npm i` then `npx shopify theme dev --store your-store.myshopify.com`.

## Set up the club page
1. Online Store > Pages > Add page, title "Club", and in *Theme template* choose `page.club`. The handle must be `club` so that the menu links (`/pages/club`) work.
2. Add your wines as products. For the best look upload a bottle photo on a **transparent background (PNG)** as the first product image.
3. Club sign-ups are saved as **customers** in Shopify with the tags `wine-club`, `tier-...` and (if ticked) `marketing-ok`. Use these tags in Shopify Email or Flow to run the club.

## Checks
```bash
npx shopify theme check      # 0 errors (4 warnings: Google Fonts are loaded from Google)
node preview/build.js        # renders every template locally with mock data into preview/dist
```

## Limits (honest notes)
- The Cellar Circle form creates a customer record. A real subscription (recurring billing, skip/pause) needs a subscriptions app such as Shopify Subscriptions.
- The heart button saves favourites on the visitor's device only (no wishlist app).
- Bottle images and scenes in `assets/` are AI-generated placeholders.
