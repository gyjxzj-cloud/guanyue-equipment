/**
 * Client-side Geo-Language Redirect
 * 
 * Uses Cloudflare's CF-IPCountry as a JS variable or falls back
 * to a lightweight IP geolocation API to redirect visitors
 * to their target language.
 * 
 * This file should be loaded in <head> before any other content
 * to minimize the "flash" of wrong language.
 */
(function() {
  // Country → Language mapping (same as server-side)
  var COUNTRY_LANG = {
    // Middle East & North Africa (Arabic)
    'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar', 'BH': 'ar', 'OM': 'ar',
    'IQ': 'ar', 'JO': 'ar', 'LB': 'ar', 'YE': 'ar', 'SY': 'ar', 'PS': 'ar',
    'EG': 'ar', 'SD': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar',
    'MR': 'ar', 'SO': 'ar', 'DJ': 'ar',

    // Spanish-speaking
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
    'EC': 'es', 'VE': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
    'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es',
    'UY': 'es', 'PR': 'es',

    // Russian-speaking / Central Asia
    'RU': 'ru', 'KZ': 'ru', 'UZ': 'ru', 'KG': 'ru', 'TJ': 'ru', 'TM': 'ru',
    'BY': 'ru', 'UA': 'ru', 'AM': 'ru', 'AZ': 'ru', 'GE': 'ru', 'MD': 'ru',

    // French-speaking
    'FR': 'fr', 'CI': 'fr', 'SN': 'fr', 'CM': 'fr', 'ML': 'fr', 'MG': 'fr',
    'BF': 'fr', 'NE': 'fr', 'TD': 'fr', 'CG': 'fr', 'CD': 'fr', 'GA': 'fr',
    'GN': 'fr', 'BJ': 'fr', 'RW': 'fr', 'BI': 'fr', 'TG': 'fr', 'CF': 'fr',
    'HT': 'fr', 'MC': 'fr', 'BE': 'fr', 'CH': 'fr',
  };

  var currentPath = window.location.pathname;

  // Only redirect from / or non-language-prefixed paths
  if (currentPath !== '/' && !currentPath.match(/^\/(en|ar|es|ru|fr)\//) && currentPath !== '') {
    return;
  }

  // Already has language prefix? Don't redirect
  if (currentPath.match(/^\/(en|ar|es|ru|fr)\/?$/)) {
    return;
  }

  // Try to get country from Cloudflare header (via dummy fetch)
  var userLang = navigator.language || navigator.userLanguage || '';
  var targetLang = 'en';

  // First check: URL parameter override
  var urlParams = new URLSearchParams(window.location.search);
  var forceLang = urlParams.get('lang');
  if (forceLang && ['en','ar','es','ru','fr'].includes(forceLang)) {
    targetLang = forceLang;
  } else {
    // Use browser language as a hint, then check specific countries
    var countryCode = '';
    
    // Cloudflare injects a cf_country cookie for their proxied sites
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i].trim();
      if (c.indexOf('cf_country=') === 0) {
        countryCode = c.substring('cf_country='.length);
        break;
      }
    }

    if (countryCode && COUNTRY_LANG[countryCode]) {
      targetLang = COUNTRY_LANG[countryCode];
    } else if (userLang.startsWith('ar')) {
      targetLang = 'ar';
    } else if (userLang.startsWith('es')) {
      targetLang = 'es';
    } else if (userLang.startsWith('ru')) {
      targetLang = 'ru';
    } else if (userLang.startsWith('fr')) {
      targetLang = 'fr';
    }
  }

  // Redirect if not already on the right language
  if (targetLang !== 'en') {
    var redirectTo = '/' + targetLang + '/';
    if (currentPath !== redirectTo) {
      window.location.replace(redirectTo);
    }
  }
})();
