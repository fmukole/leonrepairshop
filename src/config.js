/* =====================================================================
 *  BUSINESS SETTINGS — the ONE place to change contact details.
 *  After editing, run:  npm run build
 * ===================================================================== */
module.exports = {
  name: 'Leon Repair Shop',
  shortName: 'Leon',
  tagline: 'Repair. Buy. Refurbish. Sell.',

  // WhatsApp number in INTERNATIONAL format, digits only (no +, no spaces, no leading 0).
  // 065 121 0115  ->  27651210115
  // ⚠ Taken from Leon's banner artwork. Leon must confirm this number is on WhatsApp before launch.
  whatsapp: '27651210115',

  // Shown on the site for calls. Leave '' to hide.
  phoneDisplay: '065 121 0115',
  phoneLink: '+27651210115',

  // ⚠ Taken from Leon's banner artwork — confirm the mailbox exists before launch.
  email: 'info@leonrepairshop.co.za',

  // Location. Street address is NOT published until Leon supplies it.
  city: 'Cape Town',
  region: 'Western Cape',
  country: 'ZA',
  streetAddress: '', // e.g. '12 Example Road, Parow' — leave '' to hide
  mapLink: '',       // Google Maps share link — leave '' to hide

  // Trading hours. Leave the array empty to show "Message Leon for current hours".
  // Example: [{ days: 'Mon – Fri', time: '08:00 – 17:00' }, { days: 'Sat', time: '08:00 – 13:00' }]
  hours: [],

  // Suburbs Leon visits for house calls, listed in the House Calls section on the home page.
  // Leave empty until Leon confirms them (the line is then hidden). Example: ['Parow', 'Bellville', 'Goodwood']
  serviceAreas: [],

  // Live website address (used for sitemap, SEO and share links).
  // Live address. Change to 'https://www.leonrepairshop.co.za' once that domain is connected.
  siteUrl: 'https://leon-repair-shop.vercel.app',

  social: {
    facebook: '', // full URL, '' to hide
    instagram: '',
    tiktok: '',
  },

  // While this is true, the shop shows a small "sample listing" notice on every product,
  // because the starter catalogue uses illustrative prices. Set to false once
  // products.js holds Leon's real stock and prices.
  sampleCatalogue: true,
};
