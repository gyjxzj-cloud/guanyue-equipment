/**
 * Guanyu Equipment - Geo Language Router
 * 
 * Deploy this worker on Cloudflare to automatically redirect
 * visitors to their local language based on country.
 */

// Country → Language mapping
const COUNTRY_LANG = {
  // Middle East & North Africa (Arabic)
  'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar', 'BH': 'ar', 'OM': 'ar',
  'IQ': 'ar', 'JO': 'ar', 'LB': 'ar', 'YE': 'ar', 'SY': 'ar', 'PS': 'ar',
  'EG': 'ar', 'SD': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar',
  'MR': 'ar', 'SO': 'ar', 'DJ': 'ar',

  // Spanish-speaking (Latin America & Spain)
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
  'EC': 'es', 'VE': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
  'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es',
  'UY': 'es', 'PR': 'es',

  // Portuguese (Brazil)
  'BR': 'es', // redirect to Spanish as fallback (can change to pt later)

  // Russian-speaking (Central Asia & CIS)
  'RU': 'ru', 'KZ': 'ru', 'UZ': 'ru', 'KG': 'ru', 'TJ': 'ru', 'TM': 'ru',
  'BY': 'ru', 'UA': 'ru', 'AM': 'ru', 'AZ': 'ru', 'GE': 'ru', 'MD': 'ru',

  // French-speaking Africa
  'FR': 'fr', 'CI': 'fr', 'SN': 'fr', 'CM': 'fr', 'ML': 'fr', 'MG': 'fr',
  'BF': 'fr', 'NE': 'fr', 'TD': 'fr', 'CG': 'fr', 'CD': 'fr', 'GA': 'fr',
  'GN': 'fr', 'BJ': 'fr', 'RW': 'fr', 'BI': 'fr', 'TG': 'fr', 'CF': 'fr',
  'HT': 'fr', 'MC': 'fr', 'BE': 'fr', 'CH': 'fr',
};

// Languages that have RTL direction
const RTL_LANGS = ['ar'];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only redirect the root path (/) or if no language prefix
  // Don't redirect API, static files, or already-prefixed paths
  if (
    path.startsWith('/en/') || path.startsWith('/ar/') ||
    path.startsWith('/es/') || path.startsWith('/ru/') ||
    path.startsWith('/fr/') ||
    path.startsWith('/cdn-cgi/') ||
    path.startsWith('/.well-known/') ||
    path === '/robots.txt' ||
    path === '/sitemap.xml' ||
    path.startsWith('/css/') ||
    path.startsWith('/js/') ||
    path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot)$/i)
  ) {
    return fetch(request);
  }

  // Get visitor's country from Cloudflare headers
  const country = request.cf ? request.cf.country || '' : '';
  const targetLang = COUNTRY_LANG[country] || 'en';

  // If already on the correct language, don't redirect
  if (path === '/' + targetLang || path.startsWith('/' + targetLang + '/')) {
    return fetch(request);
  }

  // If on root path, redirect to language
  if (path === '/' || path === '') {
    const redirectUrl = '/' + targetLang + '/';
    return Response.redirect(new URL(redirectUrl, url), 302);
  }

  // For non-root paths without language prefix, just pass through
  // Hugo's default content language (English) will handle it
  return fetch(request);
}