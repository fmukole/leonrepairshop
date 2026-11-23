/*
 * Image optimiser.
 *
 *   npm run images
 *
 * 1. Turns every photo you drop into  /product-photos  into web-ready .webp
 *    files in  src/assets/img/products  (a large and a small version).
 *    Use the file name (without extension) in products.js, e.g. "fridge-01".
 * 2. (First set-up only) converts the site photos listed in SITE_PHOTOS below
 *    from Leon's original photo folder.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT_SITE = path.join(ROOT, 'src/assets/img/site');
const OUT_PROD = path.join(ROOT, 'src/assets/img/products');
const INBOX = path.join(ROOT, 'product-photos');
const SRC = 'C:/Users/Administrator/Desktop/LEON WEBSITE STUFF';

// key -> source file (relative to SRC). Sizes: [large, small]
const SITE_PHOTOS = {
  'hero-counter': 'LEON STORE STUFF/20260317_142047.jpg',
  'shop-front': 'LEON STORE STUFF/20260317_141935.jpg',
  'yard-appliances': 'LEON STORE STUFF/20260317_151338.jpg',
  'leon-shelves': 'LEON STORE STUFF/20260317_142109.jpg',
  'leon-fridge': 'LEON STORE STUFF/20260317_142053.jpg',
  'shelves-parts': 'LEON PHOTOS)/display-on-shelves-at-Leon-repair-shop.webp',
  'shelves-hardware': 'LEON PHOTOS)/handiman-accessories-for -sale.webp',
  'microwave-repair': 'LEON PHOTOS)/microwave-on-repair.webp',
  'tech-microwave': 'LEON PHOTOS)/technician-repairing-microwave.webp',
  'testing-board': 'LEON PHOTOS)/testing-electronic-board.webp',
  'washer-motor': 'LEON PHOTOS)/LEON HOMEPAGE PHOTOS/washing-machine-engine.webp',
  'tool-demo': 'LEON PHOTOS)/demonstrating-the-working-condition-of -tool.webp',
  'fridge-repair': 'LEON PHOTOS)/broken-fridge-for-repair.webp',
  'grinder-work': 'LEON PHOTOS)/technician-at-work-outside.webp',
  'appliance-stack': 'LEON PHOTOS)/stack-of-appliance-for-repair.webp',
  'fridge-delivery': 'LEON STORE STUFF/frifge-being-prepared-for-delivery.webp',
  'washers-display': 'LEON STORE STUFF/refurbished-washing-machine-stack-together.webp',
  'tools-display': 'LEON STORE STUFF/secondhand-tools-on-display.webp',
  'electrical-tools': 'LEON STORE STUFF/electrician-3273340_1280.webp',
  'tv-repair': 'LEON PHOTOS)/testing-electronic-of-appliance.webp',
  'bits': 'LEON STORE STUFF/blickpixel-bit-628596.jpg',
  'nuts': 'LEON STORE STUFF/byrev-nut-87527.jpg',
  'sewing': 'LEON STORE STUFF/machine-4907216_1280.webp',
  'compressor': 'LEON STORE STUFF/displayed-gas-tank.webp',
  'vacuum': 'LEON PHOTOS)/LEON HOMEPAGE PHOTOS/vacuum-cleaner-for-sale.webp',
  'microwave-white': 'LEON STORE STUFF/restored-microwave-for-sale.webp',
};

// Seed product photos (only used for the sample catalogue)
const SEED_PRODUCTS = {
  'washer-toploader-1': 'LEON PHOTOS)/washing-machine-for-sale.webp',
  'washer-toploader-2': 'LEON PHOTOS)/refurbished-washing-machine-and-microwave-on-display.webp',
  'washer-frontloader-1': 'LEON STORE STUFF/refurbished-washing-machine.webp',
  'washer-frontloader-2': 'LEON STORE STUFF/refurbished-washing-machine-stack-together.webp',
  'fridge-upright-1': 'LEON STORE STUFF/fridge-for-sale.webp',
  'fridge-upright-2': 'LEON STORE STUFF/frifge-being-prepared-for-delivery.webp',
  'microwave-1': 'LEON STORE STUFF/restored-microwave-for-sale.webp',
  'microwave-2': 'LEON STORE STUFF/microwave-sale.webp',
  'stove-hybrid-1': 'LEON STORE STUFF/hybrid-stove-for-sale.webp',
  'fryer-double-1': 'LEON STORE STUFF/frying-stove-for sale.webp',
  'drill-cordless-1': 'LEON PHOTOS)/LEON HOMEPAGE PHOTOS/tool-for-sale.webp',
  'grinder-1': 'LEON PHOTOS)/soiled-grinder-for-sale.webp',
  'circular-saw-1': 'LEON STORE STUFF/jeanvdmeulen-car-4900733.jpg',
  'vacuum-1': 'LEON PHOTOS)/LEON HOMEPAGE PHOTOS/vacuum-cleaner-for-sale.webp',
  'iron-1': 'LEON STORE STUFF/tonyzhu-electric-iron-5112.jpg',
  'washer-motor-1': 'LEON PHOTOS)/LEON HOMEPAGE PHOTOS/washing-machine-engine.webp',
  'compressor-1': 'LEON STORE STUFF/displayed-gas-tank.webp',
  'bit-set-1': 'LEON STORE STUFF/blickpixel-bit-628601.jpg',
  'electrical-kit-1': 'LEON STORE STUFF/electrician-3273340_1280.webp',
  'generator-1': 'LEON STORE STUFF/igorovsyannykov-energy-3628560.jpg',
  'sewing-1': 'LEON STORE STUFF/machine-4907216_1280.webp',
  'fasteners-1': 'LEON STORE STUFF/byrev-nut-87527.jpg',
  'tool-used-1': 'LEON STORE STUFF/secondhand-power -tool-for-sale.webp',
  'microwave-board-1': 'LEON PHOTOS)/inside-microwave-electrical-connections.webp',
};

async function convert(src, outDir, key, sizes) {
  const [lg, sm] = sizes;
  const big = path.join(outDir, `${key}.webp`);
  const small = path.join(outDir, `${key}-sm.webp`);
  const share = path.join(outDir, key + '-share.jpg');
  if (fs.existsSync(big) && fs.statSync(big).mtimeMs > fs.statSync(src).mtimeMs && (outDir !== OUT_PROD || fs.existsSync(share))) return false;
  const img = sharp(src).rotate(); // respect phone EXIF orientation
  await img.clone().resize({ width: lg, height: lg, fit: 'inside', withoutEnlargement: true }).webp({ quality: 76 }).toFile(big);
  await img.clone().resize({ width: sm, height: sm, fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(small);
  // JPG share image for WhatsApp / Facebook link previews
  if (outDir === OUT_PROD) await img.clone().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78 }).toFile(path.join(outDir, key + '-share.jpg'));
  return true;
}

(async () => {
  fs.mkdirSync(OUT_SITE, { recursive: true });
  fs.mkdirSync(OUT_PROD, { recursive: true });
  fs.mkdirSync(INBOX, { recursive: true });
  let n = 0;

  if (fs.existsSync(SRC)) {
    for (const [k, f] of Object.entries(SITE_PHOTOS)) {
      const src = path.join(SRC, f);
      if (!fs.existsSync(src)) { console.warn('missing', f); continue; }
      if (await convert(src, OUT_SITE, k, k.startsWith('hero') ? [2000, 1000] : [1400, 700])) n++;
    }
    for (const [k, f] of Object.entries(SEED_PRODUCTS)) {
      const src = path.join(SRC, f);
      if (!fs.existsSync(src)) { console.warn('missing', f); continue; }
      if (await convert(src, OUT_PROD, k, [1200, 600])) n++;
    }
    // Logo sizes
    const logo = path.join(OUT_SITE, 'logo-src.png');
    if (fs.existsSync(logo)) {
      await sharp(logo).resize(160).png().toFile(path.join(OUT_SITE, 'logo-160.png'));
      await sharp(logo).resize(320).png().toFile(path.join(OUT_SITE, 'logo-320.png'));
      await sharp(logo).resize(512).png().toFile(path.join(ROOT, 'src/assets/img/icon-512.png'));
      await sharp(logo).resize(180).flatten({ background: '#ffffff' }).png().toFile(path.join(ROOT, 'src/assets/img/apple-touch-icon.png'));
      await sharp(logo).resize(48).png().toFile(path.join(ROOT, 'src/assets/img/favicon-48.png'));
    }
    // Social share image (1200x630)
    const og = path.join(SRC, 'LEON PHOTOS)/ChatGPT Image May 9, 2026, 02_51_35 PM.webp');
    if (fs.existsSync(og)) await sharp(og).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(OUT_SITE, 'og-image.jpg'));
  }

  // Owner's inbox: drop photos into /product-photos, run `npm run images`
  for (const f of fs.readdirSync(INBOX)) {
    if (!/\.(jpe?g|png|webp|heic|avif)$/i.test(f)) continue;
    const key = f.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (await convert(path.join(INBOX, f), OUT_PROD, key, [1200, 600])) { n++; console.log('  product photo ready:', key); }
  }
  // Extra responsive widths (420px for phone cards, 1000px for mid screens),
  // derived from the large version so phones never download desktop-sized photos.
  for (const sub of ['site', 'products']) {
    const dir = path.join(ROOT, 'src/assets/img', sub);
    for (const f of fs.readdirSync(dir)) {
      if (!/\.webp$/.test(f) || /-(sm|xs|md)\.webp$/.test(f)) continue;
      const base = path.join(dir, f);
      const w = (await sharp(base).metadata()).width;
      for (const [suffix, width] of [['xs', 420], ['md', 1000]]) {
        const out = base.replace(/\.webp$/, `-${suffix}.webp`);
        if (w <= width + 100 || (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(base).mtimeMs)) continue;
        await sharp(base).resize({ width }).webp({ quality: 72 }).toFile(out);
        n++;
      }
    }
  }
  // Header logo as WebP (shown at 46px, so 96px covers high-density phone screens)
  const logoSrc = path.join(OUT_SITE, 'logo-src.png');
  if (fs.existsSync(logoSrc)) await sharp(logoSrc).resize(96).webp({ quality: 85 }).toFile(path.join(OUT_SITE, 'logo-96.webp'));

  // Size manifest so the build can write width/height on every <img> (no layout shift)
  const manifest = {};
  for (const sub of ['site', 'products']) {
    const dir = path.join(ROOT, 'src/assets/img', sub);
    for (const f of fs.readdirSync(dir)) {
      if (!/\.webp$/.test(f)) continue;
      const m = await sharp(path.join(dir, f)).metadata();
      manifest[`${sub}/${f.replace(/\.webp$/, '')}`] = [m.width, m.height];
    }
  }
  fs.writeFileSync(path.join(ROOT, 'src/data/image-sizes.json'), JSON.stringify(manifest, null, 0));
  console.log(`Images done (${n} converted).`);
})();
