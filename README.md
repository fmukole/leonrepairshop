# Leon Repair Shop website

A fast, static, WhatsApp-first website: repair enquiries, house-call requests, the Flip Shop catalogue, Sell to Leon and spare parts.
There are no logins, no cart and no database. Every enquiry opens WhatsApp with the details already written.

## Project structure

```
src/
  config.js            ← business name, WhatsApp number, phone, email, hours, address, service areas
  data/products.js     ← the Flip Shop catalogue (add / edit / remove products here)
  data/categories.js   ← shop categories
  data/services.js     ← repair services listed on the Repair Services page
  data/image-sizes.json  (made automatically, don't edit)
  assets/css/site.css  ← all styling
  assets/js/site.js    ← menu, forms → WhatsApp, shop search/filters, gallery
  assets/img/site/     ← page photos and logo
  assets/img/products/ ← product photos (made by `npm run images`)
product-photos/        ← drop new product photos here
scripts/
  build.js             ← builds every page into /dist
  pages.js             ← page content and layout for each page
  components.js        ← product cards, shop listing, forms
  layout.js            ← header, navigation, footer
  lib.js               ← WhatsApp links, prices, icons
  images.js            ← optimises photos
  serve.js             ← local preview server
dist/                  ← the finished website (upload this folder)
netlify.toml           ← Netlify settings
```

## Everyday commands

You need Node.js installed once (nodejs.org). In this folder:

| Command | What it does |
|---|---|
| `npm install` | First time only |
| `npm run dev` | Build the site and preview it at http://localhost:4330 |
| `npm run images` | Optimise new photos placed in `product-photos/` |
| `npm run build` | Rebuild `/dist` after any change |

On Windows PowerShell use `npm.cmd` instead of `npm` if `npm` is blocked.

## Adding a product

1. Take clear photos (landscape or portrait, good light, plain background helps).
2. Name them simply, e.g. `defy-fridge-1.jpg`, `defy-fridge-2.jpg`, and put them in `product-photos/`.
3. Run `npm run images`. They appear in `src/assets/img/products/` as `defy-fridge-1.webp` etc.
4. Open `src/data/products.js`, copy an existing `{ ... },` block, paste it at the top of the list and change:
   - `id`: unique, lowercase with dashes, e.g. `defy-fridge-freezer-silver` (this becomes the web address)
   - `name`, `category` (an id from `categories.js`), `brand`
   - `price`: a number like `3200`, or `null` to show "Ask for price"
   - `condition`: `'new'`, `'refurbished'`, `'pre-owned'` or `'used-as-is'`
   - `availability`: `'available'`, `'reserved'` or `'sold'`
   - `warranty`: e.g. `'3-month workshop warranty'`, or `''`
   - `images`: `['defy-fridge-1', 'defy-fridge-2']` (no extension; first one is the main photo)
   - `description`, `specs`, `featured` (true shows it on the home page), `dateAdded` (`'2026-11-23'`)
5. Run `npm run build` and upload `/dist` (or push to Netlify).

The build checks the catalogue and stops with a plain-English message if something is wrong (missing photo, typo in a condition, duplicate id).

**Sold an item?** Change `availability` to `'sold'`. It disappears from the shop listing (customers can tick "Include sold items"), and its page stays up with an "Ask about similar items" button, so old WhatsApp links still work.
**Remove completely:** delete its block.

**Before launch:** the starter catalogue is sample data built from workshop photos with illustrative prices. Replace it with real stock, then set `sampleCatalogue: false` in `src/config.js` to remove the "Sample listing" notices.

## Changing the WhatsApp number

Open `src/config.js` and change `whatsapp` to the number in international format, digits only:
`065 121 0115` → `27651210115`. Then `npm run build`. Every WhatsApp button on the site uses this one setting.

## Changing contact details

All in `src/config.js`:
- `phoneDisplay` / `phoneLink`: the phone number shown and dialled (`''` hides it)
- `email`
- `streetAddress` and `mapLink`: left empty until Leon wants the address published
- `hours`: e.g. `[{ days: 'Mon – Fri', time: '08:00 – 17:00' }, { days: 'Sat', time: '08:00 – 13:00' }]`
- `serviceAreas`: suburbs for house calls, e.g. `['Parow', 'Bellville', 'Goodwood']`
- `social`: Facebook / Instagram / TikTok links
- `siteUrl`: the live domain (used in the sitemap and share previews)

## Hosting and deployment

**Live now on Vercel:** https://leon-repair-shop.vercel.app (project `leon-repair-shop`).
**Code on GitHub:** https://github.com/fmukole/leonrepairshop (private).

To publish changes:
1. `npm run build` and check it with `npm run dev`.
2. `git add -A`, `git commit -m "what changed"`, `git push` to save the code on GitHub.
3. That's it: GitHub and Vercel are connected, so every push to `main` is published automatically within about a minute. Vercel runs `node scripts/build.js` itself (no packages to install), as set in `vercel.json`. Check progress at vercel.com → leon-repair-shop → Deployments.
   (Manual fallback without GitHub: `npx vercel@latest deploy --prod --yes` in this folder.)

When the domain is connected in Vercel (Project → Settings → Domains), change `siteUrl` in `src/config.js` to it and redeploy.

The site is plain HTML, CSS and a little JavaScript, so it runs on any static host.

**Netlify (recommended, free tier is enough)**
- Easiest: run `npm run build`, then drag the `dist` folder onto app.netlify.com/drop.
- Or connect a Git repository: Netlify reads `netlify.toml` (build command `npm run build`, publish folder `dist`).
- Add the domain (e.g. leonrepairshop.co.za) under Domain settings and point the DNS as Netlify instructs. HTTPS is automatic.

**cPanel / shared hosting (e.g. Afrihost, Hetzner, Xneelo)**
- Run `npm run build` and upload the *contents* of `dist/` into `public_html/` with File Manager or FTP.

After the site is live, submit `https://www.leonrepairshop.co.za/sitemap.xml` in Google Search Console and create or claim the Google Business Profile.

## SEO included

Unique titles and descriptions per page, canonical URLs, Open Graph share previews (JPG images for WhatsApp/Facebook), XML sitemap, robots.txt, LocalBusiness, Product, Service, FAQ and Breadcrumb structured data, semantic headings and alt text, and a page for every shop category.

## Remaining launch requirements

- [ ] Leon confirms **065 121 0115** is the WhatsApp business number (taken from the banner artwork).
- [ ] Leon confirms **info@leonrepairshop.co.za** works, and that the domain **leonrepairshop.co.za** is registered.
- [ ] Trading hours, and whether to publish the street address and a Google Maps link.
- [ ] House-call service areas (suburbs) and call-out arrangements.
- [ ] Real products, prices and photos; then set `sampleCatalogue: false`.
- [ ] Warranty terms Leon is willing to offer (shown per product).
- [ ] Payment methods Leon accepts (the FAQ currently says to ask Leon).
- [ ] Social media links, if any.
- [ ] Brand name check: the site uses "Leon Repair Shop" (as on the logo). The brief also uses "Leon Repair & Flip"; change `name` in `config.js` if that is preferred.
- [ ] Google Business Profile and Search Console set-up after launch.
