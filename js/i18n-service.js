var gTrans = {
  title: {
    en: 'my Memes',
    es: 'Mis Cosas Por Hacer',
    he: 'המימים שלי',
  },
  'lang-pick': {
    en: 'Lang',
    es: 'Mis Cosas Por Hacer',
    he: 'שפה',
  },
  'btn-gallery': {
    en: 'Gallery',
    he: 'גלריה',
  },
  'btn-memes': {
    en: 'Memes',
    he: 'המימים',
  },
  'input-text': {
    en: 'Enter text',
    he: 'הכנס טקסט',
  },
  'input-search': {
    en: 'Search',
    he: 'חיפוש',
  },
  stroke: {
    en: 'Stroke',
    he: 'מסגרת',
  },
  'btn-download': {
    en: 'Download ',
    he: 'הורדה',
  },
  'btn-share': {
    en: 'Share ',
    he: 'שתף',
  },
  'btn-save': {
    en: 'Save',
    he: 'שמור',
  },
  dog: {
    en: 'Dog',
    he: 'כלב',
  },
  cat: {
    en: 'Cat ',
    he: 'חתול',
  },
  trump: {
    en: 'Trump ',
    he: 'דונלד',
  },
  'my-name': {
    en: 'Shani Aharon',
    he: 'שני אהרון',
  },
  rights: {
    en: 'All rights reserved shani aharon ',
    he: 'כל הזכויות שמורות שני אהרון',
  },
};

var gCurrLang = 'en';

function getTrans(transKey) {
  var keyTrans = gTrans[transKey];
  // TODO: if key is unknown return 'UNKNOWN'
  if (!keyTrans) return 'UNKNOWN';
  // TODO: get from gTrans
  var txt = keyTrans[gCurrLang];
  // TODO: If translation not found - use english
  if (!txt) txt = keyTrans.en;
  return txt;
}

function doTrans() {
  // TODO:
  // for each el:
  //    get the data-trans and use getTrans to replace the innerText
  var els = document.querySelectorAll('[data-trans]');
  els.forEach((el) => {
    var elTrans = el.dataset.trans;
    //  ITP: support placeholder
    if (el.nodeName === 'INPUT') {
      el.placeholder = getTrans(elTrans);
    } else {
      el.innerText = getTrans(elTrans);
    }
  });
}

function setLang(lang) {
  gCurrLang = lang;
}

function getLang() {
  return gCurrLang;
}

function formatNumOlder(num) {
  return num.toLocaleString('es');
}

function formatNum(num) {
  return new Intl.NumberFormat(gCurrLang).format(num);
}

//change to fit the lang
function formatCurrency(num, lang) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: lang === 'he' ? 'ILS' : 'USD',
  }).format(num);
}

function formatDate(time) {
  var options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat(gCurrLang, options).format(time);
}

function kmToMiles(km) {
  return km / 1.609;
}
