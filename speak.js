/* =====================================================================
   다인에듀 말하기 연습 (Dain Speak) — 모든 어학 사이트 공통 모듈
   - 🔊 원어민 듣기(브라우저 음성) · 🎙 말하기 평가(음성 인식) · ⏺ 녹음(기기에만 저장)
   - 정확도·완성도·유창성 자동 평가, XP·레벨·배지, 반(클래스) 순위, 전체 통합 리그
   - guard.js가 자동으로 불러옵니다. 직접 넣을 때:
     <script src="https://yalli2.github.io/site_main_control/speak.js" data-site="저장소" data-lang="es" defer></script>
   - 끄기: 사이트 스크립트에 data-speak="off" 또는 콘솔 사이트 정책 speak:false
   ===================================================================== */
(function () {
  'use strict';
  if (window.__DAIN_SPEAK__) return;
  window.__DAIN_SPEAK__ = true;

  var FBV = '10.12.2';
  var me = document.currentScript;
  var attr = function (n) { return me ? me.getAttribute(n) : null; };
  var BASE = (me && me.src) ? me.src.replace(/speak\.js.*$/, '') : 'https://yalli2.github.io/site_main_control/';
  var RAW_SITE = attr('data-site') || decodeURIComponent(location.pathname.split('/')[1] || 'root');
  var SITE = String(RAW_SITE).toLowerCase();
  if (attr('data-speak') === 'off') return;
  try { var pc = JSON.parse(localStorage.getItem('smc:site:' + SITE) || 'null'); if (pc && pc.speak === false) return; } catch (e) {}

  /* ---------------- 언어 ---------------- */
  var LANGS = {
    es: { ko: '스페인어', en: 'Spanish', flag: '🇪🇸', tts: ['es-ES', 'es-MX', 'es-US'], sr: 'es-ES', sc: 'latin', cps: 10 },
    en: { ko: '영어', en: 'English', flag: '🇺🇸', tts: ['en-US', 'en-GB', 'en-AU'], sr: 'en-US', sc: 'latin', cps: 11 },
    fr: { ko: '프랑스어', en: 'French', flag: '🇫🇷', tts: ['fr-FR', 'fr-CA'], sr: 'fr-FR', sc: 'latin', cps: 10 },
    it: { ko: '이탈리아어', en: 'Italian', flag: '🇮🇹', tts: ['it-IT'], sr: 'it-IT', sc: 'latin', cps: 10 },
    pt: { ko: '포르투갈어', en: 'Portuguese', flag: '🇧🇷', tts: ['pt-BR', 'pt-PT'], sr: 'pt-BR', sc: 'latin', cps: 10 },
    ca: { ko: '카탈루냐어', en: 'Catalan', flag: '🏴', tts: ['ca-ES'], fb: 'es-ES', sr: 'ca-ES', sc: 'latin', cps: 10 },
    la: { ko: '라틴어', en: 'Latin', flag: '🏛️', tts: ['it-IT'], sr: null, sc: 'latin', cps: 9 },
    zh: { ko: '중국어', en: 'Chinese', flag: '🇨🇳', tts: ['zh-CN', 'zh-TW', 'zh-HK'], sr: 'zh-CN', sc: 'han', cps: 3.6 },
    ja: { ko: '일본어', en: 'Japanese', flag: '🇯🇵', tts: ['ja-JP'], sr: 'ja-JP', sc: 'ja', cps: 6 },
    ar: { ko: '아랍어', en: 'Arabic', flag: '🇸🇦', tts: ['ar-SA', 'ar-EG', 'ar'], sr: 'ar-SA', sc: 'ar', cps: 9 },
    ru: { ko: '러시아어', en: 'Russian', flag: '🇷🇺', tts: ['ru-RU'], sr: 'ru-RU', sc: 'cyr', cps: 10 }
  };
  var SITE_LANG = {};
  function put(l, s) { s.split(/\s+/).forEach(function (k) { if (k) SITE_LANG[k.toLowerCase()] = l; }); }
  put('es', 'dele_a1 dele_a2 dele_b1 dele_b2 dele_c1 dele_c2 dainedu_dele_b1 dainedu_dele_b2 gdu_basico gdu_intermedio gdu_avanzado gdu gdu_a1_b2 gdu_b1_b2 gdu_c1_c2 ' +
    'flex_dainedu snult_dainedu flex_spanish snult_spanish travel_spanish travel_spanish_8w basic_grammar_12w dainedu_spanish_basic_grammar sample_class ' +
    'aula1 aula2 aula3 aula4 aula5 eco_a1 metodo_a1 activas1 major_spanish major_spanish_v2 spa_con spa_con_9 spanish_conversation spanish_verb spa_verb_conjugator ' +
    'confusing_spanish spa_level_test 1500_a1 1500_a2 1500_b1 1500_b2 1500_c1 1500_c2 construction_spanish_1 construction_spanish_2 construction_spanish_3 ' +
    'ibs_final jiyu_spanish jiyu_test_1113 jiyu_test_1113-2 fayston_1114 fayston_20261121 hoyeon_spanish_unidad2 hoyeon_tarea speaking-test oral-test ' +
    'dalton_spanish_essay tuescueladeespanol inventos_100 spanish_time');
  put('en', 'world_english toeic_speaking eng_verb_500 dk_efe_cb_l2 makegethave spanish-chapter5');
  put('zh', 'chinese_grammar hsk_1_cb hsk_2_cb hsk_3_cb hsk_4a_cb hsk_4b_cb hsk_5a_cb hsk_5b_cb hsk_6a_cb hsk_6b_cb');
  put('ja', 'jap_gra_n5 jap_con');
  put('fr', 'delf_a1 delf_a2j delf_b2 delf_b2j french_conversation');
  put('ru', 'russian_grammar'); put('la', 'latin_grammar latin_verb'); put('it', 'italian_grammar');
  put('ar', 'arabic_grammar basic_arabic'); put('ca', 'catalan_grammar'); put('pt', 'por_gra');
  function guessLang(s) {
    if (/hsk|chinese|mandarin/.test(s)) return 'zh';
    if (/jlpt|^jap_|japanese/.test(s)) return 'ja';
    if (/delf|french|francais/.test(s)) return 'fr';
    if (/toeic|english|^eng_|efe/.test(s)) return 'en';
    if (/spanish|^spa_|^dele|^gdu|^aula|espanol|español/.test(s)) return 'es';
    if (/russian/.test(s)) return 'ru'; if (/latin/.test(s)) return 'la'; if (/italian/.test(s)) return 'it';
    if (/arabic/.test(s)) return 'ar'; if (/catalan/.test(s)) return 'ca'; if (/portug|^por_/.test(s)) return 'pt';
    return null;
  }
  var LANG = attr('data-lang') || SITE_LANG[SITE] || guessLang(SITE);
  if (LANG) LANG = String(LANG).toLowerCase().split('-')[0];
  if (!LANG || !LANGS[LANG]) return;
  var LG = LANGS[LANG];

  var UIK = /^ko/i.test(navigator.language || 'ko');
  function tx(ko, en) { return UIK ? ko : en; }
  function lname(l) { var o = LANGS[l]; return o ? (UIK ? o.ko : o.en) : l; }

  /* ---------------- 유틸 ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function LSget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function LSset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayStr(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }
  function weekKey(d) {
    d = d ? new Date(d) : new Date();
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    var y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    var wk = Math.ceil(((t - y0) / 86400000 + 1) / 7);
    return 'w' + t.getUTCFullYear() + '_' + pad(wk);
  }
  function hash(s) { var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
  function rid(n) { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; var b = crypto.getRandomValues(new Uint8Array(n)); for (var i = 0; i < n; i++) s += a[b[i] % a.length]; return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmtDate(ts) { var d = new Date(ts); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = rej; (document.head || document.documentElement).appendChild(s); });
  }

  /* ---------------- 점수·레벨·배지 ---------------- */
  function lvlOf(xp) { return Math.floor(Math.sqrt((xp || 0) / 20)) + 1; }
  function xpAt(l) { return 20 * (l - 1) * (l - 1); }
  var TITLES = [[1, '새싹', 'Sprout'], [3, '도전자', 'Challenger'], [5, '수다쟁이', 'Chatterbox'], [8, '발표왕', 'Speaker'], [12, '원어민급', 'Native-like'], [16, '레전드', 'Legend']];
  function titleOf(l) { var t = TITLES[0]; TITLES.forEach(function (x) { if (l >= x[0]) t = x; }); return UIK ? t[1] : t[2]; }
  function gradeOf(s) { return s >= 95 ? 'S' : s >= 85 ? 'A' : s >= 70 ? 'B' : s >= 50 ? 'C' : 'D'; }
  function praise(s) {
    return s >= 95 ? tx('완벽해요! 원어민 같아요 🎉', 'Perfect! Native-like 🎉') : s >= 85 ? tx('아주 잘했어요! 👏', 'Great job! 👏') : s >= 70 ? tx('좋아요! 조금만 더 또렷하게 💪', 'Good! A bit clearer 💪')
      : s >= 50 ? tx('괜찮아요. 원어민 음성을 다시 듣고 따라 해 봐요 🔊', 'Not bad. Listen again and repeat 🔊') : tx('한 번 더! 천천히 또박또박 말해 봐요 🐢', 'Try again, slowly and clearly 🐢');
  }
  var TIERS = [[0, '브론즈', 'Bronze', '#b4743c'], [50, '실버', 'Silver', '#8a94a6'], [150, '골드', 'Gold', '#d4a017'], [400, '플래티넘', 'Platinum', '#2a9d8f'], [1000, '다이아', 'Diamond', '#5b6cff']];
  function tierOf(x) { var t = TIERS[0]; TIERS.forEach(function (r) { if ((x || 0) >= r[0]) t = r; }); return { name: UIK ? t[1] : t[2], color: t[3] }; }
  var BADGES = [
    ['first', '🎤', '첫 목소리', 'First voice', '첫 말하기 평가', function (s) { return s.attempts >= 1; }],
    ['a50', '🔥', '50회 연습', '50 tries', '말하기 50회', function (s) { return s.attempts >= 50; }],
    ['a200', '💪', '200회 연습', '200 tries', '말하기 200회', function (s) { return s.attempts >= 200; }],
    ['a1000', '🏆', '1000회 연습', '1000 tries', '말하기 1000회', function (s) { return s.attempts >= 1000; }],
    ['p1', '💯', '완벽 발음', 'Perfect', '95점 이상 1회', function (s) { return s.perfect >= 1; }],
    ['p10', '🎯', '발음 장인', 'Sharpshooter', '95점 이상 10회', function (s) { return s.perfect >= 10; }],
    ['p50', '👑', '발음 마스터', 'Master', '95점 이상 50회', function (s) { return s.perfect >= 50; }],
    ['s3', '📅', '3일 연속', '3-day streak', '3일 연속 연습', function (s) { return s.streak >= 3; }],
    ['s7', '🗓️', '7일 연속', '7-day streak', '7일 연속 연습', function (s) { return s.streak >= 7; }],
    ['s30', '🌈', '30일 연속', '30-day streak', '30일 연속 연습', function (s) { return s.streak >= 30; }],
    ['poly', '🌍', '다국어', 'Polyglot', '3개 언어 연습', function (s) { return Object.keys(s.lx || {}).filter(function (k) { return s.lx[k] > 0; }).length >= 3; }],
    ['cls', '🤝', '반 친구', 'Classmate', '반에 가입', function (s) { return (s.classes || []).length >= 1; }],
    ['lv5', '⭐', '레벨 5', 'Level 5', '레벨 5 달성', function (s) { return lvlOf(s.xp) >= 5; }],
    ['lv10', '🌟', '레벨 10', 'Level 10', '레벨 10 달성', function (s) { return lvlOf(s.xp) >= 10; }]
  ];

  /* ---------------- 상태 ---------------- */
  var ST = {
    open: false, tab: 'practice', view: 'card', items: [], idx: -1, cur: null, heard: [], busy: false, result: null, live: '',
    q: '', user: null, cloud: null, classes: {}, clsSel: null, members: null, league: null, leagueMode: 'week', msg: '', authTab: 'in',
    recs: null, recFilter: 'site', slow: false, mini: LSget('dspk:mini', false)
  };
  function acctKey() { return ST.user ? ST.user.uid : 'guest'; }
  function blankStats() { return { xp: 0, attempts: 0, sumScore: 0, perfect: 0, streak: 0, lastDay: '', lx: {}, wk: {}, badges: [], classes: [], best: {}, day: { d: '', n: {}, xp: 0 }, name: '' }; }
  var S = loadStats();
  function loadStats() { var s = LSget('dspk:stats:' + acctKey(), null) || blankStats(); var b = blankStats(); for (var k in b) if (s[k] == null) s[k] = b[k]; return s; }
  function saveStats() { var b = S.best, keys = Object.keys(b); if (keys.length > 3000) keys.slice(0, keys.length - 3000).forEach(function (k) { delete b[k]; }); LSset('dspk:stats:' + acctKey(), S); }
  function pendKey() { return 'dspk:pending:' + acctKey(); }
  function getPending() { return LSget(pendKey(), { by: {}, badges: [] }); }
  function setPending(p) { LSset(pendKey(), p); }

  /* ---------------- 녹음 저장소 (IndexedDB, 기기에만) ---------------- */
  var IDB = {
    db: null,
    open: function () {
      var self = this; if (self.db) return Promise.resolve(self.db);
      return new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('noidb'));
        var r = indexedDB.open('dain_speak', 1);
        r.onupgradeneeded = function () { var os = r.result.createObjectStore('rec', { keyPath: 'id' }); os.createIndex('ts', 'ts'); };
        r.onsuccess = function () { self.db = r.result; res(self.db); }; r.onerror = function () { rej(r.error); };
      });
    },
    tx: function (mode) { return this.open().then(function (db) { return db.transaction('rec', mode).objectStore('rec'); }); },
    add: function (o) { var self = this; return this.tx('readwrite').then(function (s) { return new Promise(function (res) { s.put(o).onsuccess = function () { res(); self.prune(); }; }); }).catch(function () {}); },
    all: function () { return this.tx('readonly').then(function (s) { return new Promise(function (res) { var q = s.getAll(); q.onsuccess = function () { res((q.result || []).sort(function (a, b) { return b.ts - a.ts; })); }; q.onerror = function () { res([]); }; }); }).catch(function () { return []; }); },
    get: function (id) { return this.tx('readonly').then(function (s) { return new Promise(function (res) { var q = s.get(id); q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(null); }; }); }).catch(function () { return null; }); },
    del: function (id) { return this.tx('readwrite').then(function (s) { return new Promise(function (res) { s.delete(id).onsuccess = function () { res(); }; }); }).catch(function () {}); },
    prune: function () { var self = this; this.all().then(function (list) { list.slice(300).forEach(function (r) { self.del(r.id); }); }); }
  };

  /* ---------------- 음성 합성 (원어민 듣기) ---------------- */
  var synth = window.speechSynthesis || null;
  var Voice = {
    list: [],
    load: function () { if (synth) { try { this.list = synth.getVoices() || []; } catch (e) { this.list = []; } } },
    forLang: function () {
      var codes = LG.tts.map(function (c) { return c.toLowerCase(); }), base = LANG === 'la' ? 'it' : LANG;
      return this.list.filter(function (v) { var l = String(v.lang || '').replace('_', '-').toLowerCase(); return codes.indexOf(l) >= 0 || l.split('-')[0] === base; });
    },
    pick: function () {
      var want = LSget('dspk:voice:' + LANG, ''), vs = this.forLang(), v;
      if (want) v = vs.filter(function (x) { return x.name === want; })[0];
      if (!v) { var good = /google|natural|neural|premium|enhanced|siri/i; for (var i = 0; i < LG.tts.length && !v; i++) { var c = LG.tts[i].toLowerCase(); v = vs.filter(function (x) { return String(x.lang).replace('_', '-').toLowerCase() === c && good.test(x.name); })[0] || vs.filter(function (x) { return String(x.lang).replace('_', '-').toLowerCase() === c; })[0]; } }
      if (!v) v = vs[0];
      if (!v && LG.fb) { var fb = LG.fb.toLowerCase(); v = this.list.filter(function (x) { return String(x.lang).replace('_', '-').toLowerCase() === fb; })[0]; }
      return v || null;
    },
    say: function (text, rate, onend) {
      if (!synth) { toast(tx('이 브라우저는 음성 재생을 지원하지 않아요', 'Speech playback is not supported')); onend && onend(); return; }
      try {
        synth.cancel();
        var u = new SpeechSynthesisUtterance(String(text)); u.__dspk = 1;
        var v = this.pick(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = LG.tts[0];
        u.rate = rate || (ST.slow ? 0.65 : 0.92);
        u.onend = u.onerror = function () { onend && onend(); };
        synth.speak(u);
      } catch (e) { onend && onend(); }
    }
  };
  if (synth) { Voice.load(); try { synth.addEventListener('voiceschanged', function () { Voice.load(); if (ST.open) render(); }); } catch (e) {} }

  /* 사이트에서 재생한 원어민 문장 기억 → "방금 들은 문장" */
  if (synth) {
    try {
      var _speak = synth.speak.bind(synth);
      synth.speak = function (u) {
        try { if (u && !u.__dspk && u.text) heard(u.text, u.lang); } catch (e) {}
        return _speak(u);
      };
    } catch (e) {}
  }
  function heard(text, lang) {
    var l = String(lang || '').toLowerCase().split(/[-_]/)[0];
    var runs = extract(String(text));
    var t = (l === LANG || (LANG === 'la' && l === 'it')) ? String(text).trim() : (runs[0] || '');
    if (!t || t.length > 300) return;
    ST.heard = [t].concat(ST.heard.filter(function (x) { return x !== t; })).slice(0, 6);
    if (ST.open && ST.tab === 'practice' && !ST.busy) renderSoon(); else markTab();
  }

  /* ---------------- 화면에서 목표 언어 문장 찾기 ---------------- */
  var HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
  var HANGUL_RUN = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF][\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\s,.?!~'"’”…·:;0-9]*/g;
  var LATIN_L = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/g;
  var STOP = {};
  ('language languages next prev previous back home menu quiz score scores check submit start restart reset retry answer answers show hide close open play pause stop search ' +
   'login logout sign in out unit units lesson lessons chapter chapters part level levels test tests mock review practice listen speak record ok cancel yes no all tip tips note notes ' +
   'grammar vocabulary vocab exam audio video copy link share print download upload loading correct wrong true false total page pages step steps mode dark light settings ' +
   'select choose submit clear done finish result results new edit save delete add more less list table chart dashboard guide help about contact privacy terms by for and or of the to my').split(' ').forEach(function (w) { STOP[w] = 1; });
  function cleanPiece(c) {
    return c.replace(/^[\s\d.)\]\-–—:•*·,;#№]+/, '').replace(/^[^\p{L}¿¡"“«'‘]+/u, '').replace(/[^\p{L}\p{N}.!?…"”»'’)]+$/u, '').trim();
  }
  var EN = {}; ('the and of with for to is are this that your you about from an how what my it be or by at we they he she their our will can does not which who have has ' +
    'using describe talking introduction pronunciation spelling grammar lesson unit noun verb gender plural definite article essential new skill language overview').split(' ').forEach(function (w) { EN[w] = 1; });
  function okLatin(c) {
    if (c.length < 2 || c.length > 400) return false;
    if (/https?:|www\.|@|\.(com|net|org|io|html|js)\b|[{}<>_=\\]/.test(c)) return false;
    var letters = (c.match(LATIN_L) || []).length, nonsp = c.replace(/\s/g, '').length;
    if (letters < 2 || letters / nonsp < 0.6) return false;
    if (!/[aeiouyàáâãäåèéêëìíîïòóôõöùúûüýÿæœ]/i.test(c)) return false;
    var words = c.toLowerCase().replace(/[^a-z\u00C0-\u024F\s']/g, ' ').split(/\s+/).filter(Boolean);
    if (!words.length) return false;
    var raw = c.toLowerCase().split(/\s+/).filter(Boolean);
    if (raw.every(function (w) { var x = w.replace(/[^a-z0-9\u00C0-\u024F]/g, ''); return !x || STOP[x] || /\d/.test(x) || /^[ivxlcdm]+$/.test(x); })) return false;
    if (LANG !== 'en') { var en = words.filter(function (w) { return EN[w]; }).length; if (en && en / words.length >= 0.34 && !/[àáâãäèéêëìíîïòóôõöùúûüñçœæ]/i.test(c)) return false; }
    if (/^(unit|lesson|chapter|part|level|test|mock|unidad|lecci[oó]n|tema|cap[ií]tulo|le[cç]on|unit[eé])\s*\d+\s*$/i.test(c)) return false;
    if (/^[A-Z0-9\s.]{2,6}$/.test(c) && LANG !== 'en') return false; /* 약어 */
    if (/\d/.test(c) && c === c.toUpperCase() && c.length <= 20) return false; /* 'DELE A1' 같은 제목 */
    return true;
  }
  function splitLong(t) {
    if (t.length <= 180) return [t];
    var parts = t.replace(/([.!?؟…])\s+/g, '$1\u0001').replace(/([。！？])/g, '$1\u0001').split('\u0001'), out = [], buf = '';
    parts.forEach(function (p) { if ((buf + ' ' + p).trim().length > 180 && buf) { out.push(buf.trim()); buf = p; } else buf = (buf + ' ' + p).trim(); });
    if (buf) out.push(buf.trim());
    return out;
  }
  function extract(text) {
    text = String(text || '').replace(/\u00a0/g, ' ');
    var out = [], m, re;
    var sc = LG.sc;
    if (sc === 'han' || sc === 'ja') {
      re = sc === 'han'
        ? /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF][\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\u00B7\u2018\u2019\u201C\u201D\u2026\s０-９]*/g
        : /[\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFF\uFF66-\uFF9F][\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFF\uFF66-\uFF9F\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\u30FC\u2026\s０-９]*/g;
      while ((m = re.exec(text))) { var t = m[0].replace(/[「」『』【】〔〕]/g, '').replace(/^[\s、，,。・]+|[\s、，,（(]+$/g, '').trim(); if (t) out.push(t); }
    } else if (sc === 'ar') {
      re = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s،؟!.\u200c-\u200f]*/g;
      while ((m = re.exec(text))) { var a = m[0].trim(); if ((a.match(/[\u0621-\u064A]/g) || []).length >= 2) out.push(a); }
    } else if (sc === 'cyr') {
      re = /[\u0400-\u04FF][\u0400-\u04FF\s\-–,.!?;:«»"'0-9]*/g;
      while ((m = re.exec(text))) { var c = m[0].replace(/[\s\-–,;:«"']+$/, '').trim(); if ((c.match(/[\u0400-\u04FF]/g) || []).length >= 2) out.push(c); }
    } else {
      text.split(/[\n\t|→⇒⟶=•▶►※◆■□●○✓✔✗✘「」『』]+|\s[-–—\/·]\s|[()（）\[\]{}]|:\s/).forEach(function (piece) {
        (HANGUL.test(piece) ? piece.split(HANGUL_RUN) : [piece]).forEach(function (p) { p = cleanPiece(p); if (okLatin(p)) out.push(p); });
      });
    }
    var res = [];
    out.forEach(function (t) { splitLong(t).forEach(function (x) { if (x && x.length <= 300) res.push(x); }); });
    return res;
  }
  var INLINE = {}; 'SPAN B I EM STRONG U SMALL MARK A RUBY RB SUB SUP FONT LABEL ABBR CITE Q S DEL INS BDI BDO CODE KBD TIME DFN VAR'.split(' ').forEach(function (t) { INLINE[t] = 1; });
  var SKIP = {}; 'SCRIPT STYLE NOSCRIPT TEXTAREA INPUT SELECT OPTION TEMPLATE SVG CANVAS IFRAME RT RP HEAD TITLE META LINK'.split(' ').forEach(function (t) { SKIP[t] = 1; });
  function skipEl(e) { return SKIP[e.tagName] || e === HOST || e.id === 'smc-badge' || e.id === 'smc-ov' || (e.classList && (e.classList.contains('dh-bar') || e.classList.contains('dspk-ui'))); }
  function blockOf(n) { var e = n.nodeType === 1 ? n : n.parentElement; while (e && INLINE[e.tagName] && e !== document.body) e = e.parentElement; return e; }
  function visible(e) { try { if (e.checkVisibility) return e.checkVisibility({ visibilityProperty: true, opacityProperty: false }); } catch (x) {} return e.getClientRects().length > 0; }
  function textsUnder(root) {
    var groups = new Map();
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (t) {
        if (!t.nodeValue || !t.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (var e = t.parentElement; e; e = e.parentElement) { if (skipEl(e)) return NodeFilter.FILTER_REJECT; if (e === root || e === document.body) break; }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = w.nextNode())) { var b = blockOf(n); if (!b) continue; var g = groups.get(b); if (!g) groups.set(b, g = []); g.push(n.nodeValue); }
    return groups;
  }
  function scanPage() {
    if (!document.body) return [];
    var groups = textsUnder(document.body), seen = {}, list = [];
    groups.forEach(function (parts, el) {
      if (list.length >= 400 || !visible(el)) return;
      extract(parts.join(' ')).forEach(function (t) { var k = normalize(t); if (!k || seen[k] || (CJK && Array.from(k).length < 2) || (!CJK && k.length < 2)) return; seen[k] = 1; list.push({ text: t, el: el }); });
    });
    return list;
  }

  /* ---------------- 비교·채점 ---------------- */
  var CJK = LG.sc === 'han' || LG.sc === 'ja';
  function normalize(s) {
    s = String(s || '').normalize('NFKC').toLowerCase();
    if (CJK) return s.replace(/[\p{P}\p{S}\s]/gu, '');
    if (LG.sc === 'ar') s = s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
    else if (LG.sc === 'cyr') s = s.replace(/ё/g, 'е');
    else s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’`´]/g, "'");
    return s.replace(/[^\p{L}\p{N}'\s]/gu, ' ').replace(/'(?=\s|$)|(^|\s)'/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function tokens(s) { return CJK ? Array.from(s) : s.split(' ').filter(Boolean); }
  function lev(a, b) {
    var m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) { cur[0] = i; for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); var t = prev; prev = cur; cur = t; }
    return prev[n];
  }
  function sim(a, b) { if (!a && !b) return 1; if (!a || !b) return 0; a = a.slice(0, 400); b = b.slice(0, 400); return 1 - lev(a, b) / Math.max(a.length, b.length); }
  function lcsMatch(a, b) { /* a,b 배열 → a의 일치 인덱스 */
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = new Uint16Array(n + 1); }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    var hit = {}; i = m; j = n;
    while (i > 0 && j > 0) { if (a[i - 1] === b[j - 1]) { hit[i - 1] = 1; i--; j--; } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--; }
    return hit;
  }
  function wordOk(w, pool) {
    for (var i = 0; i < pool.length; i++) { var p = pool[i]; if (p.used) continue; var s = w === p.w ? 1 : (w.length >= 4 ? sim(w, p.w) : 0); if (s >= (w.length >= 7 ? 0.7 : 0.75)) { p.used = true; return true; } }
    return false;
  }
  function score(target, alts, timing) {
    var tn = normalize(target), best = { s: -1, h: '' };
    alts.forEach(function (h) { var hn = normalize(h), s = sim(CJK ? tn : tn.replace(/ /g, ''), CJK ? hn : hn.replace(/ /g, '')); if (s > best.s) best = { s: s, h: h, hn: hn }; });
    if (!best.hn) return { total: 0, acc: 0, comp: 0, flu: null, heard: '', marks: null, empty: true };
    var acc = Math.round(clamp(best.s, 0, 1) * 100);
    var tt = tokens(tn), ht = tokens(best.hn), okIdx = {}, okN = 0;
    if (CJK) { okIdx = lcsMatch(tt, ht); okN = Object.keys(okIdx).length; }
    else { var pool = ht.map(function (w) { return { w: w }; }); tt.forEach(function (w, i) { if (wordOk(w, pool)) { okIdx[i] = 1; okN++; } }); }
    var comp = tt.length ? Math.round(okN / tt.length * 100) : 0;
    var flu = null;
    if (timing && timing.dur > 0.2) {
      var units = CJK ? tt.length : tn.replace(/ /g, '').length;
      var expect = Math.max(0.8, units / LG.cps);
      var ratio = timing.dur / expect;
      flu = ratio <= 1.25 ? 100 : 100 - (ratio - 1.25) * 40;
      if (timing.pause != null && timing.pause > 0.25) flu -= Math.min(30, (timing.pause - 0.25) * 100);
      flu = Math.round(clamp(flu, 20, 100));
    }
    var total = flu == null ? acc * 0.7 + comp * 0.3 : acc * 0.6 + comp * 0.25 + flu * 0.15;
    total = Math.round(clamp(total, 0, 100));
    return { total: total, acc: acc, comp: comp, flu: flu, heard: best.h, marks: markWords(target, okIdx) };
  }
  function markWords(target, okIdx) {
    if (CJK) {
      var k = 0, out = [];
      Array.from(String(target)).forEach(function (ch) { var n = normalize(ch); if (!n) { out.push({ t: ch, p: 1 }); return; } out.push({ t: ch, ok: !!okIdx[k] }); k += Array.from(n).length; });
      return out;
    }
    var j = 0;
    return String(target).split(/(\s+)/).map(function (w) { if (!w.trim()) return { t: w, p: 1 }; var n = normalize(w); if (!n) return { t: w, p: 1 }; var parts = n.split(' ').length, ok = true; for (var q = 0; q < parts; q++) ok = ok && !!okIdx[j + q]; j += parts; return { t: w, ok: ok }; });
  }
  function analyze(blob) {
    return Promise.race([analyze0(blob), new Promise(function (r) { setTimeout(function () { r(null); }, 3000); })]);
  }
  function analyze0(blob) {
    return new Promise(function (res) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC || !blob || !blob.size) return res(null);
        var ac = new AC();
        blob.arrayBuffer().then(function (buf) { return ac.decodeAudioData(buf); }).then(function (ab) {
          var d = ab.getChannelData(0), sr = ab.sampleRate, fr = Math.round(sr * 0.02), rms = [];
          for (var i = 0; i + fr <= d.length; i += fr) { var s = 0; for (var j = i; j < i + fr; j++) s += d[j] * d[j]; rms.push(Math.sqrt(s / fr)); }
          if (ac.close) ac.close();
          if (rms.length < 5) return res(null);
          var sorted = rms.slice().sort(function (a, b) { return a - b; }), floor = sorted[Math.floor(sorted.length * 0.2)], max = sorted[sorted.length - 1];
          if (max < 0.01) return res({ dur: 0, pause: 0 });
          var thr = floor + (max - floor) * 0.15, st = -1, en = -1;
          rms.forEach(function (v, i) { if (v > thr) { if (st < 0) st = i; en = i; } });
          if (st < 0) return res({ dur: 0, pause: 0 });
          var gap = 0, run = 0;
          for (var k = st; k <= en; k++) { if (rms[k] <= thr) run++; else { if (run >= 15) gap += run; run = 0; } }
          var dur = (en - st + 1) * 0.02;
          res({ dur: dur, pause: dur ? gap * 0.02 / dur : 0 });
        }).catch(function () { try { ac.close(); } catch (e) {} res(null); });
      } catch (e) { res(null); }
    });
  }

  /* ---------------- 말하기(녹음 + 인식) ---------------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var CAN_SR = !!(SR && LG.sr);
  var CAN_REC = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  var A = null; /* 진행 중 시도 */

  /* ---------------- 🧠 AI 음성 분석 (Whisper · 브라우저 안에서 실행) ----------------
     브라우저 음성 인식이 아무것도 못 들었을 때(녹음과 마이크 충돌, 카카오톡 인앱 브라우저, Firefox 등)
     방금 녹음한 파일을 AI가 직접 받아 적어 채점해요. 처음 한 번 모델을 내려받고 이후엔 캐시를 써요. */
  var WL = { es: 'spanish', en: 'english', fr: 'french', it: 'italian', pt: 'portuguese', ca: 'catalan', ru: 'russian', ar: 'arabic', zh: 'chinese', ja: 'japanese' };
  var MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  var AI = { lib: 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1', model: MOBILE ? 'Xenova/whisper-tiny' : 'Xenova/whisper-base', p: null, files: {}, onProg: null };
  var CAN_AI = !!(WL[LANG] && CAN_REC && (window.OfflineAudioContext || window.webkitOfflineAudioContext));
  function aiMode() { try { return sessionStorage.getItem('dspk:ai') === '1'; } catch (e) { return false; } }
  function setAiMode() { try { sessionStorage.setItem('dspk:ai', '1'); } catch (e) {} }
  function aiLoad() {
    if (!AI.p) {
      AI.p = (new Function('u', 'return import(u)'))(AI.lib).then(function (T) {
        T.env.allowLocalModels = false;
        return T.pipeline('automatic-speech-recognition', AI.model, {
          progress_callback: function (d) {
            if (d && d.status === 'progress' && d.file) AI.files[d.file] = [d.loaded || 0, d.total || 0];
            if (AI.onProg) { var l = 0, t = 0; for (var f in AI.files) { l += AI.files[f][0]; t += AI.files[f][1]; } AI.onProg(t ? l / t : 0, t); }
          }
        });
      });
      AI.p.catch(function () { AI.p = null; });
    }
    return AI.p;
  }
  function aiPcm(blob) {
    var AC = window.AudioContext || window.webkitAudioContext, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var ac = new AC();
    return blob.arrayBuffer().then(function (raw) {
      return new Promise(function (res, rej) { var p = ac.decodeAudioData(raw, res, rej); if (p && p.then) p.then(res, rej); });
    }).then(function (ab) {
      try { ac.close(); } catch (e) {}
      var off = new OAC(1, Math.max(1, Math.ceil(ab.duration * 16000)), 16000);
      var src = off.createBufferSource(); src.buffer = ab; src.connect(off.destination); src.start(0);
      return off.startRendering();
    }).then(function (r) { return r.getChannelData(0); });
  }
  function aiText(blob, onProg) {
    AI.onProg = onProg || null;
    return aiLoad().then(function (asr) {
      return aiPcm(blob).then(function (pcm) {
        var mx = 0; for (var i = 0; i < pcm.length; i += 16) mx = Math.max(mx, Math.abs(pcm[i]));
        if (mx < 0.015) return '';
        return asr(pcm, { language: WL[LANG], task: 'transcribe' }).then(function (out) {
          var t = String((out && out.text) || '').trim();
          return /^[\[(（].*[\])）]$/.test(t) ? '' : t;            /* [BLANK_AUDIO] 같은 표시 */
        });
      });
    });
  }
  /* 소리 크기 측정 · 말이 끝나면 자동 멈춤 */
  function meterStart(a) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC || !a.stream) return;
      var ac = new AC(); if (ac.state === 'suspended' && ac.resume) ac.resume().catch(function () {});
      var an = ac.createAnalyser(); an.fftSize = 1024; ac.createMediaStreamSource(a.stream).connect(an);
      var buf = new Uint8Array(an.fftSize); a.ac = ac;
      (function tick() {
        if (A !== a || a.done) return;
        an.getByteTimeDomainData(buf); var mx = 0; for (var i = 0; i < buf.length; i++) { var v = Math.abs(buf[i] - 128); if (v > mx) mx = v; }
        a.level = Math.min(1, mx / 70);
        var now = Date.now(); if (mx > 14) { a.spoke = true; a.loud = now; }
        onLevel(a);
        var heardSome = a.finals.length || a.interim;
        if (!heardSome && a.spoke && now - a.loud > (a.ai || a.srIdle ? 1400 : 2600)) { stopAttempt(); return; }
        if (!a.spoke && now - a.t0 > 9000) { stopAttempt(); return; }
        a.raf = requestAnimationFrame(tick);
      })();
    } catch (e) {}
  }
  function meterStop(a) { if (!a) return; try { cancelAnimationFrame(a.raf); } catch (e) {} if (a.ac) { try { a.ac.close(); } catch (e) {} a.ac = null; } }
  function startAttempt(inline) {
    if (ST.busy) { if (A) stopAttempt(); return; }
    if (!ST.cur) { toast(tx('먼저 연습할 문장을 고르세요', 'Pick a sentence first')); return; }
    if (!CAN_SR && !CAN_REC) { toast(tx('이 브라우저는 마이크를 지원하지 않아요. Chrome을 사용해 주세요', 'Microphone not supported. Please use Chrome')); return; }
    if (synth) try { synth.cancel(); } catch (e) {}
    A = { text: ST.cur, finals: [], alts: [], interim: '', t0: Date.now(), chunks: [], blob: null, mime: '', stream: null, mr: null, rec: null, srStart: 0, srEnd: 0, done: false, srOnly: false,
      inline: inline || null, level: 0, spoke: false, loud: 0, ai: CAN_AI && (!CAN_SR || aiMode()) };
    ST.busy = true; ST.result = null; ST.live = ''; render(); popState('listen');
    var begin = CAN_REC ? navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (s) {
      A.stream = s;
      try { A.mr = new MediaRecorder(s); A.mime = A.mr.mimeType || 'audio/webm'; var a0 = A; A.mr.ondataavailable = function (e) { if (e.data && e.data.size) a0.chunks.push(e.data); }; A.mr.start(250); } catch (e) { A.mr = null; }
      meterStart(A);
    }, function (e) {
      if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) { toast(tx('마이크 권한을 허용해 주세요 🎙', 'Please allow microphone access 🎙')); A.denied = true; }
    }) : Promise.resolve();
    begin.then(function () {
      if (!A || A.done) return;
      if (A.denied && !CAN_SR) { cancelAttempt(); return; }
      if (A.denied) A.ai = false;
      if (CAN_SR && !A.ai) startSR(); else { A.limit = setTimeout(stopAttempt, Math.min(30000, (expectSec(A.text) * 2.5 + 6) * 1000)); }
      A.hard = setTimeout(stopAttempt, 40000);
    });
  }
  function expectSec(t) { var n = normalize(t).replace(/ /g, ''); return Math.max(1, (CJK ? Array.from(n).length : n.length) / LG.cps); }
  function startSR() {
    var r; try { r = new SR(); } catch (e) { A.srFail = true; if (!A.mr) cancelAttempt(); return; }
    A.rec = r; r.lang = LG.sr; r.continuous = true; r.interimResults = true; r.maxAlternatives = 5;
    var quiet = null;
    function arm() { clearTimeout(quiet); quiet = setTimeout(function () { if (A && !A.done) stopAttempt(); }, 1500); }
    r.onspeechstart = function () { if (A) A.srStart = Date.now(); };
    r.onspeechend = function () { if (A) A.srEnd = Date.now(); };
    r.onresult = function (e) {
      if (!A) return; var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var res = e.results[i];
        if (res.isFinal) { A.finals.push(res[0].transcript); var al = []; for (var k = 0; k < res.length; k++) al.push(res[k].transcript); A.alts.push(al); }
        else interim += res[0].transcript;
      }
      A.interim = interim; ST.live = (A.finals.join(' ') + ' ' + interim).trim(); paintLive(); popLive();
      if (A.finals.length) arm();
    };
    r.onerror = function (e) {
      if (!A) return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { A.srFail = true; toast(tx('마이크(음성 인식) 권한을 허용해 주세요 🎙', 'Please allow microphone / speech recognition 🎙')); }
      else if (e.error === 'audio-capture' && A.mr && CAN_AI) { A.ai = true; A.srIdle = true; A.rec = null; return; }
      else if (e.error === 'audio-capture' && A.mr && !A.srOnly) {
        /* 녹음과 인식을 동시에 못 하는 기기 → 인식만 진행 */
        A.srOnly = true; A.rec = null; try { A.mr.stop(); } catch (x) {} stopTracks(); A.mr = null; A.chunks = [];
        setTimeout(function () { if (A && !A.done) startSR(); }, 250); return;
      } else if (e.error === 'network') { A.srFail = true; toast(tx('음성 인식 서버에 연결할 수 없어요. 녹음으로 스스로 평가해요', 'Speech service unavailable — self-check with your recording')); }
    };
    r.onend = function () { if (A && !A.done && A.rec === r) { if (A.finals.length || A.interim || A.srFail || !A.mr) stopAttempt(); else { A.srIdle = true; try { r.start(); } catch (x) { stopAttempt(); } } } };
    try { r.start(); } catch (e) { A.srFail = true; }
  }
  function stopTracks() { if (A) meterStop(A); if (A && A.stream) { try { A.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} A.stream = null; } }
  function cancelAttempt() { var inl = A && A.inline; if (A) { meterStop(A); A.done = true; clearTimeout(A.hard); clearTimeout(A.limit); try { A.rec && A.rec.abort(); } catch (e) {} try { A.mr && A.mr.state !== 'inactive' && A.mr.stop(); } catch (e) {} stopTracks(); } A = null; ST.busy = false; render(); if (inl) { chipState(inl, ''); closePop(); } }
  function stopAttempt() {
    if (!A || A.done) return; var a = A; a.done = true; clearTimeout(a.hard); clearTimeout(a.limit); meterStop(a);
    try { a.rec && a.rec.stop(); } catch (e) {}
    var recDone = new Promise(function (res) {
      if (a.mr && a.mr.state !== 'inactive') { a.mr.onstop = function () { res(); }; try { a.mr.stop(); } catch (e) { res(); } } else res();
    });
    ST.live = tx('평가하는 중…', 'Scoring…'); paintLive(); popState('scoring');
    setTimeout(function () {
      recDone.then(function () {
        stopTracks();
        if (a.chunks.length) a.blob = new Blob(a.chunks, { type: a.mime || 'audio/webm' });
        return analyze(a.blob);
      }).then(function (timing) { finishAttempt(a, timing); });
    }, CAN_SR && !a.ai ? 350 : 0);
  }
  function finishAttempt(a, timing) {
    A = null;
    var heardText = (a.finals.join(' ') + ' ' + (a.finals.length ? '' : a.interim)).trim();
    if (!heardText && a.blob && CAN_AI && !a.denied) {               /* 인식 결과 없음 → 녹음 파일을 AI로 분석 */
      ST.busy = true; ST.live = tx('🧠 AI가 녹음을 분석하는 중…', '🧠 AI is analyzing your recording…'); paintLive(); popState('ai');
      aiText(a.blob, function (p, total) { popProg(p, total); }).then(function (t) {
        if (t && CAN_SR && !a.ai) setAiMode();
        finishAttempt2(a, timing, t, 'ai');
      }, function (e) { try { console.warn('[speak] AI', e); } catch (x) {} finishAttempt2(a, timing, '', 'aifail'); });
      return;
    }
    finishAttempt2(a, timing, heardText, 'sr');
  }
  function finishAttempt2(a, timing, heardText, via) {
    ST.busy = false;
    var selfMode = !heardText && !!a.blob && (via === 'aifail' || (!CAN_AI && (!CAN_SR || a.srFail)));
    var r;
    if (!heardText && !selfMode) { r = { empty: true, total: 0, marks: null, acc: 0, comp: 0, flu: null, heard: '' }; }
    else if (selfMode) {
      r = { self: true, total: null, flu: null, blob: a.blob };
      if (timing && timing.dur > 0.2) { var ratio = timing.dur / expectSec(a.text); r.flu = Math.round(clamp(ratio <= 1.25 ? 100 : 100 - (ratio - 1.25) * 40, 20, 100)); }
    } else {
      var alts = [heardText];
      if (via === 'ai') a.alts = [];
      if (a.alts.length === 1) alts = alts.concat(a.alts[0]);
      else if (a.alts.length > 1) { /* 조각마다 가장 비슷한 후보 고르기 */
        var tn = normalize(a.text); alts.push(a.alts.map(function (al) { var b = al[0], bs = -1; al.forEach(function (x) { var s = sim(tn, normalize(x)); if (s > bs) { bs = s; b = x; } }); return b; }).join(' '));
      }
      var tm = timing || (a.srStart && a.srEnd > a.srStart ? { dur: (a.srEnd - a.srStart) / 1000, pause: null } : null);
      r = score(a.text, alts, tm); r.blob = a.blob; r.via = via;
    }
    if (via === 'aifail') r.aiFail = true;
    r.text = a.text; r.mime = a.mime; r.id = Date.now() + '-' + rid(4);
    ST.result = r; ST.live = '';
    if (!r.self && !r.empty) award(r.total, false, a.text);
    if (r.blob) IDB.add({ id: r.id, ts: Date.now(), site: SITE, lang: LANG, text: a.text, score: r.self ? null : r.total, self: !!r.self, mime: r.mime, blob: r.blob });
    ST.recs = null;
    render();
    if (a.inline) { chipState(a.inline, ''); paintChip(a.inline); popResult(); }
  }

  /* ---------------- XP 지급 ---------------- */
  function award(total, self, text) {
    var d = dayStr();
    if (S.day.d !== d) S.day = { d: d, n: {}, xp: 0 };
    var h = hash(LANG + '|' + normalize(text));
    var n = (S.day.n[h] || 0) + 1; S.day.n[h] = n;
    var xp = self ? clamp(Math.round(total / 34), 1, 3) : (total >= 95 ? 12 : total >= 85 ? 9 : total >= 70 ? 6 : total >= 50 ? 3 : 1);
    var note = '';
    if (n > 3) { xp = 0; note = tx('오늘 이 문장은 점수 최대치예요. 다른 문장도 도전!', 'Max XP for this sentence today — try another!'); }
    if (!self && total >= 85 && !(S.best[h] >= 85)) { xp += 3; note = tx('새 문장 정복 보너스 +3', 'New sentence bonus +3'); }
    if (!self) S.best[h] = Math.max(S.best[h] || 0, total);
    if (S.lastDay !== d) { S.streak = S.lastDay === yesterday() ? (S.streak || 0) + 1 : 1; S.lastDay = d; xp += 5; note = tx('오늘 첫 연습 보너스 +5 · 연속 ', "Today's first practice +5 · streak ") + S.streak + tx('일', 'd'); }
    if (S.day.xp + xp > 400) xp = Math.max(0, 400 - S.day.xp);
    S.day.xp += xp;
    var W = weekKey(), before = lvlOf(S.xp);
    S.xp += xp; S.attempts += 1; S.sumScore += total; if (!self && total >= 95) S.perfect += 1;
    S.lx[LANG] = (S.lx[LANG] || 0) + xp; S.wk[W] = (S.wk[W] || 0) + xp;
    Object.keys(S.wk).sort().slice(0, -8).forEach(function (k) { delete S.wk[k]; });
    var nb = newBadges();
    saveStats();
    if (ST.result) { ST.result.xp = xp; ST.result.note = note; }
    if (lvlOf(S.xp) > before) setTimeout(function () { toast('⬆️ ' + tx('레벨 업! Lv.', 'Level up! Lv.') + lvlOf(S.xp) + ' ' + titleOf(lvlOf(S.xp))); }, 600);
    if (nb.length) setTimeout(function () { toast(nb.map(function (b) { return b[1] + ' ' + (UIK ? b[2] : b[3]); }).join(' · ') + tx(' 배지 획득!', ' badge earned!')); }, 1600);
    if (ST.user) {
      var p = getPending(), b = p.by[LANG] || (p.by[LANG] = { xp: 0, att: 0, sum: 0, perf: 0 });
      b.xp += xp; b.att += 1; b.sum += total; if (!self && total >= 95) b.perf += 1;
      nb.forEach(function (x) { if (p.badges.indexOf(x[0]) < 0) p.badges.push(x[0]); });
      setPending(p); scheduleFlush();
    }
  }
  function newBadges() {
    var got = []; BADGES.forEach(function (b) { if (S.badges.indexOf(b[0]) < 0 && b[5](S)) { S.badges.push(b[0]); got.push(b); } });
    return got;
  }

  /* ---------------- Firebase (반·리그) ---------------- */
  var FB = null;
  function fb() {
    if (FB) return FB.p;
    FB = {};
    FB.p = (window.SMC_CONFIG ? Promise.resolve() : loadScript(BASE + 'config.js?v=' + Math.floor(Date.now() / 300000))).then(function () {
      var cfg = window.SMC_CONFIG; if (!cfg || !cfg.firebase || !cfg.firebase.apiKey) throw new Error('noconfig');
      FB.cfg = cfg;
      return Promise.all([
        import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-firestore.js')
      ]);
    }).then(function (m) {
      FB.A = m[0]; FB.Au = m[1]; FB.F = m[2];
      FB.app = FB.A.getApps().filter(function (a) { return a.name === 'smc'; })[0] || FB.A.initializeApp(FB.cfg.firebase, 'smc');
      FB.auth = FB.Au.getAuth(FB.app); FB.db = FB.F.getFirestore(FB.app);
      FB.Au.onAuthStateChanged(FB.auth, onUser);
      return FB;
    });
    FB.p.catch(function (e) { console.warn('[speak]', e); FB.err = e; });
    return FB.p;
  }
  function uref() { return FB.F.doc(FB.db, 'speak_users', ST.user.uid); }
  function cref(code) { return FB.F.doc(FB.db, 'speak_classes', code); }
  function mref(code, uid) { return FB.F.doc(FB.db, 'speak_classes', code, 'members', uid || ST.user.uid); }
  function myName() { return (S.name || (ST.user && (ST.user.displayName || (ST.user.email || '').split('@')[0])) || tx('학생', 'Student')).slice(0, 40); }
  function onUser(u) {
    var prev = ST.user ? ST.user.uid : null;
    ST.user = u && (u.emailVerified || (u.providerData || []).some(function (p) { return p.providerId === 'google.com'; })) ? u : null;
    ST.unverified = u && !ST.user ? u : null;
    if ((ST.user ? ST.user.uid : null) !== prev) { S = loadStats(); ST.cloud = null; ST.classes = {}; ST.league = null; ST.members = null; ST.clsSel = null; }
    if (ST.user) pullCloud(); else render();
  }
  function pullCloud() {
    var F = FB.F;
    F.getDoc(uref()).then(function (snap) {
      var d = snap.exists() ? snap.data() : null; ST.cloud = d || {};
      if (d) {
        ['xp', 'attempts', 'sumScore', 'perfect', 'streak'].forEach(function (k) { if (typeof d[k] === 'number') S[k] = Math.max(S[k] || 0, d[k]); });
        if (d.lastDay && d.lastDay > (S.lastDay || '')) S.lastDay = d.lastDay;
        if (d.lx) for (var k in d.lx) S.lx[k] = Math.max(S.lx[k] || 0, d.lx[k]);
        if (d.wk) for (var w in d.wk) S.wk[w] = Math.max(S.wk[w] || 0, d.wk[w]);
        (d.badges || []).forEach(function (b) { if (S.badges.indexOf(b) < 0) S.badges.push(b); });
        S.classes = (d.classes || []).slice(0, 20);
        if (d.name) S.name = d.name;
      }
      saveStats();
      return Promise.all(S.classes.map(function (c) { return F.getDoc(cref(c)).then(function (s) { return s.exists() ? [c, s.data()] : [c, null]; }, function () { return [c, undefined]; }); }));
    }).then(function (list) {
      var gone = [];
      (list || []).forEach(function (x) { if (x[1]) ST.classes[x[0]] = x[1]; else if (x[1] === null) gone.push(x[0]); });
      if (gone.length) { S.classes = S.classes.filter(function (c) { return gone.indexOf(c) < 0; }); saveStats(); FB.F.setDoc(uref(), { name: myName(), xp: S.xp, classes: S.classes }, { merge: true }).catch(function () {}); }
      var p = getPending(); if (Object.keys(p.by).length || p.badges.length) flush();
      if (!ST.cloud || !ST.cloud.name) FB.F.setDoc(uref(), { name: myName(), xp: FB.F.increment(0), classes: S.classes, updatedAt: FB.F.serverTimestamp() }, { merge: true }).catch(function (e) { console.warn('[speak] init', e.code || e); });
      render();
    }).catch(function (e) { console.warn('[speak] cloud', e.code || e); ST.cloudErr = e.code || String(e); render(); });
  }
  var flushT = null, flushing = false;
  function scheduleFlush() { clearTimeout(flushT); flushT = setTimeout(flush, 4000); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  function flush() {
    if (!ST.user || !FB || !FB.db || flushing) return;
    var p = getPending(), langs = Object.keys(p.by);
    if (!langs.length && !p.badges.length) return;
    var F = FB.F, W = weekKey(), take = {}, room = 250;
    langs.forEach(function (l) {
      var b = p.by[l]; if (room <= 0) return;
      if (b.xp <= room) { take[l] = b; room -= b.xp; }
      else { var f = room / b.xp; take[l] = { xp: room, att: Math.round(b.att * f), sum: Math.round(b.sum * f), perf: Math.round(b.perf * f) }; room = 0; }
    });
    var tot = { xp: 0, att: 0, sum: 0, perf: 0 }, lx = {};
    Object.keys(take).forEach(function (l) { var b = take[l]; tot.xp += b.xp; tot.att += b.att; tot.sum += b.sum; tot.perf += b.perf; lx[l] = F.increment(b.xp); });
    var data = {
      name: myName(), xp: F.increment(tot.xp), attempts: F.increment(tot.att), sumScore: F.increment(tot.sum), perfect: F.increment(tot.perf),
      wk: {}, lx: lx, wkId: W, streak: S.streak || 0, lastDay: S.lastDay || '', lvl: lvlOf(S.xp), classes: S.classes, updatedAt: F.serverTimestamp(), sites: {}
    };
    data.wk[W] = F.increment(tot.xp); data.sites[SITE] = F.increment(tot.att);
    var badges = p.badges.slice(); if (badges.length) data.badges = F.arrayUnion.apply(null, badges);
    flushing = true;
    F.setDoc(uref(), data, { merge: true }).then(function () {
      var q = getPending();
      Object.keys(take).forEach(function (l) { var b = q.by[l], t = take[l]; if (!b) return; b.xp -= t.xp; b.att -= t.att; b.sum -= t.sum; b.perf -= t.perf; if (b.xp <= 0 && b.att <= 0) delete q.by[l]; });
      q.badges = q.badges.filter(function (x) { return badges.indexOf(x) < 0; });
      setPending(q);
      /* 반 점수: 반의 언어가 같은(또는 '전체') 연습만 */
      return Promise.all(S.classes.map(function (code) {
        var c = ST.classes[code]; if (!c) return null;
        var m = { xp: 0, att: 0, sum: 0, perf: 0 };
        Object.keys(take).forEach(function (l) { if (c.lang === 'all' || c.lang === l) { var t = take[l]; m.xp += t.xp; m.att += t.att; m.sum += t.sum; m.perf += t.perf; } });
        if (!m.att) return null;
        var md = { name: myName(), xp: F.increment(m.xp), attempts: F.increment(m.att), sumScore: F.increment(m.sum), perfect: F.increment(m.perf), wk: {}, streak: S.streak || 0, lastDay: S.lastDay || '', lvl: lvlOf(S.xp), updatedAt: F.serverTimestamp() };
        md.wk[W] = F.increment(m.xp);
        return F.setDoc(mref(code), md, { merge: true }).catch(function (e) {
          if (e && e.code === 'permission-denied') { S.classes = S.classes.filter(function (x) { return x !== code; }); delete ST.classes[code]; saveStats(); }
        });
      }));
    }).then(function () {
      flushing = false; ST.league = null;
      var q = getPending(); if (Object.keys(q.by).length) setTimeout(flush, 1200);
    }).catch(function (e) { flushing = false; console.warn('[speak] flush', e.code || e); ST.cloudErr = e.code || String(e); });
  }

  /* 반 */
  function createClass(name, lang) {
    var F = FB.F; name = String(name || '').trim().slice(0, 40);
    if (!name) { ST.msg = tx('반 이름을 입력하세요', 'Enter a class name'); render(); return; }
    var code = rid(6);
    F.getDoc(cref(code)).then(function (s) {
      if (s.exists()) code = rid(6);
      return F.setDoc(cref(code), { name: name, owner: ST.user.uid, ownerName: myName(), lang: lang || LANG, site: SITE, createdAt: F.serverTimestamp() });
    }).then(function () { return joinClass(code, true); }).then(function () { ST.msg = ''; toast('🎉 ' + tx('반을 만들었어요! 코드 ', 'Class created! Code ') + code); })
      .catch(function (e) { ST.msg = tx('반을 만들지 못했어요: ', 'Could not create class: ') + (e.code || e.message); render(); });
  }
  function joinClass(code, quiet) {
    var F = FB.F; code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { ST.msg = tx('반 코드는 6자리예요', 'Class code has 6 characters'); render(); return Promise.resolve(); }
    if (S.classes.indexOf(code) >= 0) { ST.clsSel = code; ST.members = null; render(); return Promise.resolve(); }
    return F.getDoc(cref(code)).then(function (s) {
      if (!s.exists()) throw { code: 'notfound' };
      ST.classes[code] = s.data();
      return F.setDoc(mref(code), { name: myName(), xp: 0, attempts: 0, sumScore: 0, perfect: 0, wk: {}, streak: S.streak || 0, lastDay: S.lastDay || '', lvl: lvlOf(S.xp), joinedAt: F.serverTimestamp(), updatedAt: F.serverTimestamp() });
    }).then(function () {
      S.classes = S.classes.concat([code]).slice(-20); var nb = newBadges(); saveStats();
      var d = { name: myName(), xp: F.increment(0), classes: S.classes }; if (nb.length) d.badges = F.arrayUnion.apply(null, nb.map(function (b) { return b[0]; }));
      return F.setDoc(uref(), d, { merge: true });
    }).then(function () { ST.clsSel = code; ST.members = null; ST.msg = ''; if (!quiet) toast('🤝 ' + tx('반에 들어왔어요!', 'Joined the class!')); render(); })
      .catch(function (e) { ST.msg = e.code === 'notfound' ? tx('없는 반 코드예요. 다시 확인해 주세요', 'Class not found') : tx('가입하지 못했어요: ', 'Could not join: ') + (e.code || e.message); render(); });
  }
  function leaveClass(code) {
    var F = FB.F;
    F.deleteDoc(mref(code)).catch(function () {}).then(function () {
      S.classes = S.classes.filter(function (c) { return c !== code; }); delete ST.classes[code]; saveStats();
      return F.setDoc(uref(), { name: myName(), xp: F.increment(0), classes: S.classes }, { merge: true });
    }).then(function () { ST.clsSel = null; ST.members = null; render(); });
  }
  function loadMembers(code) {
    var F = FB.F; ST.members = 'loading';
    F.getDocs(F.collection(FB.db, 'speak_classes', code, 'members')).then(function (qs) {
      var arr = []; qs.forEach(function (d) { var x = d.data(); x.uid = d.id; arr.push(x); }); ST.members = arr; render();
    }).catch(function (e) { ST.members = []; ST.msg = e.code || String(e); render(); });
  }
  function kick(code, uid) { FB.F.deleteDoc(mref(code, uid)).then(function () { loadMembers(code); }).catch(function (e) { toast(e.code || String(e)); }); }
  function removeClass(code) {
    var F = FB.F;
    F.getDocs(F.collection(FB.db, 'speak_classes', code, 'members')).then(function (qs) {
      var ps = []; qs.forEach(function (d) { ps.push(F.deleteDoc(d.ref)); }); return Promise.all(ps);
    }).then(function () { return F.deleteDoc(cref(code)); }).then(function () { leaveClassLocal(code); toast(tx('반을 삭제했어요', 'Class deleted')); }).catch(function (e) { toast(e.code || String(e)); });
  }
  function leaveClassLocal(code) {
    S.classes = S.classes.filter(function (c) { return c !== code; }); delete ST.classes[code]; saveStats(); ST.clsSel = null; ST.members = null;
    FB.F.setDoc(uref(), { name: myName(), xp: FB.F.increment(0), classes: S.classes }, { merge: true }).catch(function () {}); render();
  }
  function saveName(n) {
    n = String(n || '').trim().slice(0, 20); if (!n) return;
    S.name = n; saveStats();
    var F = FB.F;
    F.setDoc(uref(), { name: n, xp: F.increment(0) }, { merge: true }).catch(function () {});
    S.classes.forEach(function (c) { F.updateDoc(mref(c), { name: n }).catch(function () {}); });
    toast(tx('이름을 바꿨어요', 'Name updated')); render();
  }
  /* 리그 */
  function loadLeague() {
    var F = FB.F, W = weekKey(), mode = ST.leagueMode;
    var field = mode === 'week' ? 'wk.' + W : mode === 'lang' ? 'lx.' + LANG : 'xp';
    var mine = mode === 'week' ? (S.wk[W] || 0) : mode === 'lang' ? (S.lx[LANG] || 0) : S.xp;
    ST.league = { mode: mode, rows: null, me: null };
    var coll = F.collection(FB.db, 'speak_users');
    F.getDocs(F.query(coll, F.orderBy(field, 'desc'), F.limit(50))).then(function (qs) {
      var rows = []; qs.forEach(function (d) { var x = d.data(); x.uid = d.id; x.v = mode === 'week' ? ((x.wk || {})[W] || 0) : mode === 'lang' ? ((x.lx || {})[LANG] || 0) : (x.xp || 0); if (x.v > 0) rows.push(x); });
      ST.league.rows = rows; render();
      if (mine > 0 && !rows.some(function (r) { return r.uid === ST.user.uid; }) && F.getCountFromServer) {
        F.getCountFromServer(F.query(coll, F.where(field, '>', mine))).then(function (c) { ST.league.me = c.data().count + 1; render(); }).catch(function () {});
      }
    }).catch(function (e) { ST.league.rows = []; ST.league.err = e.code || String(e); render(); });
  }
  function login(kind, em, pw, nm) {
    fb().then(function () {
      var Au = FB.Au; ST.msg = '';
      if (kind === 'google') {
        if (/KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(navigator.userAgent)) { ST.msg = tx('앱 안의 브라우저에서는 Google 로그인이 막혀 있어요. Chrome·Safari로 열어 주세요.', 'Google sign-in is blocked in in-app browsers. Open in Chrome/Safari.'); render(); return; }
        var p = new Au.GoogleAuthProvider();
        return Au.signInWithPopup(FB.auth, p).catch(function (e) { if (/popup-blocked|operation-not-supported/.test(e.code || '')) return Au.signInWithRedirect(FB.auth, p); throw e; });
      }
      if (kind === 'up') return Au.createUserWithEmailAndPassword(FB.auth, em, pw).then(function (c) { if (nm) { S.name = nm; } return Au.updateProfile(c.user, { displayName: nm || em.split('@')[0] }).then(function () { return Au.sendEmailVerification(c.user); }); })
        .then(function () { ST.msg = tx('인증 메일을 보냈어요. 메일의 링크를 누른 뒤 [인증 완료]를 눌러 주세요.', 'Verification email sent. Click the link, then press [Verified].'); render(); });
      return Au.signInWithEmailAndPassword(FB.auth, em, pw);
    }).catch(function (e) { var c = (e && e.code) || ''; ST.msg = /wrong-password|invalid-credential|user-not-found/.test(c) ? tx('이메일 또는 비밀번호가 올바르지 않아요.', 'Wrong email or password.') : /email-already/.test(c) ? tx('이미 가입된 이메일이에요. 로그인해 주세요.', 'Email already registered.') : /weak-password/.test(c) ? tx('비밀번호는 6자 이상', 'Password: 6+ characters') : /popup-closed/.test(c) ? tx('로그인 창이 닫혔어요.', 'Sign-in window closed.') : tx('로그인 오류: ', 'Sign-in error: ') + c; render(); });
  }

  /* ---------------- 화면 ---------------- */
  var HOST = document.createElement('div'); HOST.id = 'dspk-host'; HOST.className = 'dspk-ui'; HOST.setAttribute('translate', 'no');
  var R = HOST.attachShadow ? HOST.attachShadow({ mode: 'open' }) : HOST;
  var CSS = [
    ':host{font-size:14px;line-height:1.5;color:#1f2433;text-align:left;letter-spacing:normal;text-transform:none}',
    '*{box-sizing:border-box;font-family:Pretendard,"Apple SD Gothic Neo","Malgun Gothic",system-ui,-apple-system,sans-serif}',
    '.fab{position:fixed;right:0;top:58%;transform:translateY(-50%);z-index:2147483000;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 7px 10px 9px;border:0;border-radius:14px 0 0 14px;background:linear-gradient(160deg,#ff6a3d,#e0386b);color:#fff;font:700 12px/1.1 inherit;cursor:pointer;box-shadow:0 6px 20px rgba(224,56,107,.35);letter-spacing:.02em}',
    '.fab .i{font-size:20px}.fab small{font-size:10px;opacity:.9;font-weight:600}.fab .dot{position:absolute;top:6px;left:6px;width:8px;height:8px;border-radius:50%;background:#ffe14d;display:none}.fab.new .dot{display:block}',
    '.fab.mini{padding:8px 5px 8px 7px}.fab.mini b,.fab.mini small{display:none}',
    '.fab:hover{filter:brightness(1.06)}',
    '.pn{position:fixed;top:12px;right:12px;bottom:12px;width:400px;max-width:calc(100vw - 24px);z-index:2147483001;background:#fffdf9;color:#1f2433;border-radius:20px;box-shadow:0 24px 70px rgba(20,24,40,.28);display:flex;flex-direction:column;overflow:hidden;transform:translateX(calc(100% + 30px));transition:transform .28s cubic-bezier(.2,.8,.2,1);font-size:14px;line-height:1.5}',
    '.pn.on{transform:none}',
    '@media (max-width:520px){.pn{top:0;right:0;bottom:0;max-width:100vw;width:100vw;border-radius:0}}',
    '.hd{display:flex;align-items:center;gap:10px;padding:14px 14px 10px 16px;background:linear-gradient(135deg,#1f2433,#33304d);color:#fff}',
    '.hd h2{margin:0;font-size:16px;font-weight:800;flex:1;display:flex;align-items:center;gap:6px}.hd h2 small{font-weight:600;font-size:12px;opacity:.75}',
    '.lv{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border-radius:999px;padding:4px 10px 4px 4px;font-size:12px;font-weight:700;cursor:pointer;border:0;color:#fff}',
    '.lv i{font-style:normal;background:#ffd166;color:#3b2b00;border-radius:999px;padding:2px 7px;font-size:11px}',
    '.x{border:0;background:rgba(255,255,255,.14);color:#fff;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer}',
    '.tabs{display:flex;gap:2px;padding:6px 8px 0;background:linear-gradient(135deg,#1f2433,#33304d)}',
    '.tabs button{flex:1;border:0;background:transparent;color:rgba(255,255,255,.7);padding:9px 4px 10px;font:700 12.5px inherit;border-radius:12px 12px 0 0;cursor:pointer}',
    '.tabs button.on{background:#fffdf9;color:#1f2433}',
    '.bd{flex:1;overflow:auto;padding:14px 16px 20px}',
    '.row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '.btn{border:1px solid #e4ddd0;background:#fff;color:#1f2433;border-radius:11px;padding:8px 11px;font:700 12.5px inherit;cursor:pointer;display:inline-flex;align-items:center;gap:5px;line-height:1.2}',
    '.btn:hover{border-color:#b9ae9a}.btn.p{background:#1f2433;color:#fff;border-color:#1f2433}.btn.a{background:#e0386b;color:#fff;border-color:#e0386b}.btn.on{background:#fff3d6;border-color:#e8b74a}.btn.s{padding:5px 8px;font-size:11.5px;border-radius:9px}.btn.g{background:transparent;border-color:transparent;color:#6b6457}.btn:disabled{opacity:.45;cursor:default}',
    '.chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}.chip{border:1px dashed #d8cdb8;background:#fff;border-radius:999px;padding:5px 10px;font-size:12.5px;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chip:hover{border-style:solid;border-color:#e0386b}',
    '.lbl{font-size:11.5px;font-weight:800;color:#8a8170;letter-spacing:.04em;margin:14px 0 6px;text-transform:uppercase}',
    '.card{background:#fff;border:1px solid #efe7d8;border-radius:16px;padding:14px;margin-top:12px;box-shadow:0 2px 0 #f3ecdf}',
    '.tt{font-size:20px;font-weight:700;line-height:1.45;color:#1f2433;word-break:break-word;min-height:30px}.tt.ph{font-size:14px;font-weight:600;color:#9a917f}',
    '.tt .w{border-radius:5px;padding:0 1px}.tt .ok{background:#d7f5e4;color:#0b6b3a}.tt .no{background:#ffe0e3;color:#b3123a;text-decoration:underline wavy #f08ca0}',
    '.nav{display:flex;align-items:center;gap:6px;margin-top:10px}.nav .sp{flex:1}.nav small{color:#8a8170;font-weight:700}',
    'select{border:1px solid #e4ddd0;border-radius:10px;padding:6px 8px;font:600 12px inherit;background:#fff;max-width:150px;color:#1f2433}',
    '.mw{display:flex;flex-direction:column;align-items:center;margin:16px 0 4px}',
    '.mic{width:84px;height:84px;border-radius:50%;border:0;font-size:34px;cursor:pointer;display:grid;place-items:center;padding:0;background:radial-gradient(circle at 35% 30%,#ff8a5c,#e0386b);color:#fff;box-shadow:0 10px 26px rgba(224,56,107,.38);transition:transform .15s}',
    '.mic:hover{transform:scale(1.04)}.mic.rec{background:radial-gradient(circle at 35% 30%,#ff5f5f,#c8102e);animation:pulse 1.1s infinite}',
    '@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(200,16,46,.45)}70%{box-shadow:0 0 0 18px rgba(200,16,46,0)}100%{box-shadow:0 0 0 0 rgba(200,16,46,0)}}',
    '.hint{margin-top:8px;font-size:12.5px;color:#7c735f;text-align:center}.live{min-height:20px;margin-top:6px;font-size:13.5px;color:#1f2433;text-align:center;font-weight:600}',
    '.res{display:flex;gap:14px;align-items:center}',
    '.ring{--p:0;--c:#e0386b;width:78px;height:78px;border-radius:50%;background:conic-gradient(var(--c) calc(var(--p)*1%),#f1ebe0 0);display:grid;place-items:center;flex:none}',
    '.ring span{width:62px;height:62px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:22px;font-weight:900;color:#1f2433}',
    '.grade{display:inline-block;font-weight:900;font-size:13px;padding:2px 8px;border-radius:7px;background:#1f2433;color:#ffd166;margin-right:6px}',
    '.xp{display:inline-block;font-weight:800;font-size:12px;color:#0b6b3a;background:#d7f5e4;border-radius:999px;padding:2px 8px;margin-top:6px}',
    '.bars{margin-top:12px;display:grid;gap:7px}.bar{display:grid;grid-template-columns:62px 1fr 34px;gap:8px;align-items:center;font-size:12px;font-weight:700;color:#5e5647}',
    '.bar .t{height:8px;border-radius:99px;background:#f1ebe0;overflow:hidden}.bar .t i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#ffb347,#e0386b)}',
    '.heard{margin-top:10px;font-size:12.5px;color:#6b6457;background:#faf6ee;border-radius:10px;padding:8px 10px}',
    '.note{font-size:12px;color:#8a6d1d;margin-top:6px}',
    '.stars{display:flex;gap:4px;justify-content:center;margin:8px 0}.stars button{border:0;background:#fff7df;font-size:16px;font-weight:800;color:#8a6d1d;width:44px;height:44px;border-radius:12px;cursor:pointer}.stars button:hover{background:#ffe9a8}',
    '.list{display:flex;flex-direction:column;gap:6px;margin-top:10px}.it{display:flex;gap:8px;align-items:flex-start;text-align:left;border:1px solid #efe7d8;background:#fff;border-radius:12px;padding:9px 11px;cursor:pointer;font:600 13.5px/1.45 inherit;color:#1f2433;width:100%}',
    '.it:hover{border-color:#e0386b}.it .n{flex:none;font-size:11px;color:#a59c88;min-width:20px;margin-top:2px}.it .b{margin-left:auto;flex:none;font-size:11px;font-weight:800;color:#0b6b3a}',
    'input[type=text],input[type=email],input[type=password],input[type=search],textarea{width:100%;border:1px solid #e4ddd0;border-radius:11px;padding:10px 12px;font:600 14px inherit;color:#1f2433;background:#fff;outline:none}',
    'input:focus,textarea:focus{border-color:#e0386b}textarea{min-height:80px;resize:vertical}',
    '.stat{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px}.stat div{background:#fff;border:1px solid #efe7d8;border-radius:13px;padding:10px 12px}.stat b{display:block;font-size:20px;font-weight:900}.stat small{color:#8a8170;font-weight:700;font-size:11.5px}',
    '.lvc{background:linear-gradient(135deg,#1f2433,#4a2d5e);color:#fff;border-radius:16px;padding:14px 16px}.lvc b{font-size:22px}.lvc .pg{height:8px;border-radius:99px;background:rgba(255,255,255,.18);margin-top:8px;overflow:hidden}.lvc .pg i{display:block;height:100%;background:#ffd166;border-radius:99px}',
    '.bg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}.bg div{text-align:center;background:#fff;border:1px solid #efe7d8;border-radius:12px;padding:8px 4px;font-size:10.5px;font-weight:700;color:#5e5647}.bg div span{display:block;font-size:22px}.bg div.off{opacity:.35;filter:grayscale(1)}',
    '.lb{display:flex;flex-direction:column;gap:4px;margin-top:8px}.lr{display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:center;background:#fff;border:1px solid #efe7d8;border-radius:12px;padding:8px 10px;font-size:13px}',
    '.lr.me{border-color:#e0386b;background:#fff4f6}.lr .rk{font-weight:900;text-align:center;color:#8a8170}.lr .nm{font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lr .nm small{display:block;font-weight:600;color:#8a8170;font-size:11px}.lr .v{font-weight:900;color:#1f2433;text-align:right}.lr .v small{display:block;font-weight:700;font-size:10.5px;color:#8a8170}',
    '.seg{display:flex;background:#f1ebe0;border-radius:12px;padding:3px;gap:3px}.seg button{flex:1;border:0;background:transparent;border-radius:9px;padding:7px 4px;font:800 12px inherit;color:#6b6457;cursor:pointer}.seg button.on{background:#fff;color:#1f2433;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
    '.tier{display:inline-flex;align-items:center;gap:5px;font-weight:900;font-size:12px;border-radius:999px;padding:3px 10px;color:#fff}',
    '.msg{margin-top:10px;font-size:12.5px;font-weight:700;color:#b3123a;background:#fff0f2;border-radius:10px;padding:8px 10px}.msg.ok{color:#0b6b3a;background:#e9f9f0}',
    '.muted{color:#8a8170;font-size:12.5px}.c{text-align:center}.mt{margin-top:10px}.w100{width:100%;justify-content:center}',
    '.cl{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #efe7d8;border-radius:14px;padding:10px 12px;cursor:pointer;width:100%;text-align:left;font:inherit;color:inherit;margin-top:6px}.cl:hover{border-color:#e0386b}.cl b{display:block;font-size:14px}.cl small{color:#8a8170;font-weight:600}.cl .code{margin-left:auto;font:800 12px ui-monospace,monospace;background:#f1ebe0;border-radius:8px;padding:4px 7px}',
    '.rec{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #efe7d8;border-radius:12px;padding:8px 10px;margin-top:6px}.rec .t{flex:1;min-width:0;font-weight:700;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rec .t small{display:block;font-weight:600;color:#8a8170;font-size:11px}.rec .sc{font-weight:900;font-size:13px;min-width:30px;text-align:right}',
    '.sel{position:fixed;z-index:2147483002;display:none;gap:4px;background:#1f2433;color:#fff;border-radius:12px;padding:5px;box-shadow:0 8px 24px rgba(0,0,0,.25)}.sel.on{display:flex}.sel button{border:0;background:rgba(255,255,255,.1);color:#fff;border-radius:8px;padding:6px 9px;font:700 12px inherit;cursor:pointer}.sel button:hover{background:rgba(255,255,255,.22)}',
    '.pickbar{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483002;background:#1f2433;color:#fff;border-radius:999px;padding:8px 8px 8px 16px;display:none;align-items:center;gap:10px;font:700 13px inherit;box-shadow:0 10px 30px rgba(0,0,0,.3)}.pickbar.on{display:flex}.pickbar button{border:0;background:#e0386b;color:#fff;border-radius:999px;padding:6px 12px;font:800 12px inherit;cursor:pointer}',
    '.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);z-index:2147483003;background:#1f2433;color:#fff;border-radius:14px;padding:10px 16px;font:700 13px inherit;opacity:0;transition:.25s;pointer-events:none;max-width:90vw;text-align:center}.toast.on{opacity:1;transform:translateX(-50%)}',
    '.ip{position:fixed;z-index:2147483002;display:none;background:#fffdf9;color:#1f2433;border:1px solid #efe7d8;border-radius:16px;box-shadow:0 18px 50px rgba(20,24,40,.28);padding:12px 14px 14px;font-size:13.5px;line-height:1.5;max-height:calc(100vh - 16px);overflow:auto}.ip.on{display:block;animation:ipin .18s ease}',
    '@keyframes ipin{from{opacity:0;transform:translateY(-4px)}}',
    '.ip-h{display:flex;gap:8px;align-items:flex-start}.ip-t{flex:1;font-size:16px;font-weight:700;line-height:1.45;word-break:break-word}.ip-t .w{border-radius:5px;padding:0 1px}.ip-t .ok{background:#d7f5e4;color:#0b6b3a}.ip-t .no{background:#ffe0e3;color:#b3123a;text-decoration:underline wavy #f08ca0}',
    '.ip-x{border:0;background:#f1ebe0;color:#6b6457;width:26px;height:26px;border-radius:50%;cursor:pointer;flex:none;font-size:13px}',
    '.ip-b{margin-top:10px}.ip-st{display:flex;align-items:center;gap:8px}.ip-dot{width:12px;height:12px;border-radius:50%;background:#c8102e;animation:blink 1s infinite;flex:none}@keyframes blink{50%{opacity:.25}}',
    '.ip-spin{width:14px;height:14px;border-radius:50%;border:2.5px solid #f1ebe0;border-top-color:#e0386b;animation:spin .8s linear infinite;flex:none}@keyframes spin{to{transform:rotate(360deg)}}',
    '.ip-m{height:8px;border-radius:99px;background:#f1ebe0;overflow:hidden;margin-top:9px}.ip-m i{display:block;height:100%;width:0;background:linear-gradient(90deg,#16a34a,#e0a100,#e0386b);transition:width .08s}.ip-m.pg i{background:#e0386b;transition:width .3s}',
    '.ip-live{min-height:18px;margin-top:6px;color:#6b6457;font-style:italic}.ip .ring.sm{width:62px;height:62px}.ip .ring.sm span{width:48px;height:48px;font-size:18px}.ip .res{gap:12px}.ip .bars{margin-top:10px}.ip .row .muted{font-size:11.5px}',
    '.box{position:fixed;z-index:2147482999;pointer-events:none;border:2px solid #e0386b;border-radius:8px;background:rgba(224,56,107,.08);display:none;transition:all .08s}.box.on{display:block}.box i{position:absolute;top:-24px;left:-2px;background:#e0386b;color:#fff;font:800 11px/1 inherit;font-style:normal;border-radius:6px 6px 6px 0;padding:5px 7px;white-space:nowrap}'
  ].join('\n');

  function toast(m) { var t = R.querySelector('.toast'); if (!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('on'); }, 2600); }
  function markTab() { var f = R.querySelector('.fab'); if (f && !ST.open) f.classList.add('new'); }

  function mount() {
    if (!document.body || HOST.isConnected) return;
    R.innerHTML = '<style>' + CSS + '</style>' +
      '<button class="fab' + (ST.mini ? ' mini' : '') + '" title="' + esc(tx('말하기 연습 (Alt+S)', 'Speaking practice (Alt+S)')) + '"><span class="dot"></span><span class="i">🎙</span><b>' + esc(tx('말하기', 'Speak')) + '</b><small>' + LG.flag + '</small></button>' +
      '<section class="pn" role="dialog" aria-label="' + esc(tx('말하기 연습', 'Speaking practice')) + '"></section>' +
      '<div class="sel"><button data-act="selPractice">🎙 ' + esc(tx('따라 말하기', 'Practice')) + '</button><button data-act="selSay">🔊</button></div>' +
      '<div class="pickbar"><span>🎯 ' + esc(tx('연습할 문장을 누르세요', 'Click a sentence to practice')) + '</span><button data-act="pickOff">' + esc(tx('취소', 'Cancel')) + '</button></div>' +
      '<div class="ip" role="dialog"></div><div class="box"><i>🎙 ' + esc(tx('이 문장 연습', 'Practice this')) + '</i></div><div class="toast" role="status"></div>';
    document.body.appendChild(HOST);
    var lockSync = function () { HOST.style.display = document.documentElement.classList.contains('smc-lock') ? 'none' : ''; };
    lockSync(); try { new MutationObserver(lockSync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
    R.querySelector('.fab').addEventListener('click', function () { openPanel(!ST.open); });
    R.addEventListener('click', onClick);
    R.addEventListener('change', onChange);
    R.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter' && e.target.dataset && e.target.dataset.enter) { e.preventDefault(); act(e.target.dataset.enter, e.target); } });
    R.addEventListener('keyup', function (e) { e.stopPropagation(); }); R.addEventListener('keypress', function (e) { e.stopPropagation(); });
    R.addEventListener('input', function (e) { if (e.target.name === 'q') { ST.q = e.target.value; renderList(); } });
  }
  function openPanel(on) {
    ST.open = on; var pn = R.querySelector('.pn'); if (!pn) return;
    if (on) { R.querySelector('.fab').classList.remove('new'); if (!ST.items.length) ST.items = scanPage(); render(); fb(); }
    pn.classList.toggle('on', on);
    R.querySelector('.fab').style.display = on ? 'none' : '';
    if (!on) { if (ST.busy) cancelAttempt(); }
  }

  var rT = null;
  function renderSoon() { clearTimeout(rT); rT = setTimeout(render, 60); }
  function render() {
    var pn = R.querySelector('.pn'); if (!pn) return;
    if (!ST.open) { pn.innerHTML = ''; return; }
    var lv = lvlOf(S.xp);
    var focus = R.activeElement && R.activeElement.name, fv = focus ? R.activeElement.value : null, selS = focus ? R.activeElement.selectionStart : 0;
    pn.innerHTML =
      '<div class="hd"><h2>🎙 ' + esc(tx('말하기 연습', 'Speaking')) + ' <small>' + LG.flag + ' ' + esc(lname(LANG)) + '</small></h2>' +
      '<button class="lv" data-act="tab" data-v="me" title="XP ' + S.xp + '"><i>Lv.' + lv + '</i>' + esc(titleOf(lv)) + '</button>' +
      '<button class="x" data-act="close" aria-label="close">✕</button></div>' +
      '<nav class="tabs">' + [['practice', '🎙 ' + tx('연습', 'Practice')], ['me', '📊 ' + tx('내 기록', 'Me')], ['class', '👥 ' + tx('우리 반', 'Class')], ['league', '🏆 ' + tx('리그', 'League')]].map(function (t) {
        return '<button class="' + (ST.tab === t[0] ? 'on' : '') + '" data-act="tab" data-v="' + t[0] + '">' + esc(t[1]) + '</button>'; }).join('') + '</nav>' +
      '<div class="bd">' + (ST.tab === 'practice' ? vPractice() : ST.tab === 'me' ? vMe() : ST.tab === 'class' ? vClass() : vLeague()) + '</div>';
    if (focus) { var el = R.querySelector('[name="' + focus + '"]'); if (el) { el.focus(); if (fv != null && el.value !== fv) el.value = fv; try { el.setSelectionRange(selS, selS); } catch (e) {} } }
    if (ST.tab === 'me' && ST.recs == null) { ST.recs = 'loading'; IDB.all().then(function (l) { ST.recs = l; if (ST.tab === 'me') render(); }); }
    if (ST.tab === 'league' && ST.user && !ST.league) loadLeague();
    if (ST.tab === 'class' && ST.user && ST.clsSel && ST.members == null) loadMembers(ST.clsSel);
  }
  function paintLive() { var l = R.querySelector('.live'); if (l) l.textContent = ST.live || ''; }

  /* 연습 화면 */
  function vPractice() {
    var h = '';
    if (ST.view === 'list') return vList();
    if (ST.view === 'type') {
      return '<div class="lbl">✏️ ' + esc(tx('직접 입력', 'Type your own')) + '</div><textarea name="typed" placeholder="' + esc(tx(lname(LANG) + ' 문장을 입력하거나 붙여 넣으세요', 'Type or paste a ' + lname(LANG) + ' sentence')) + '"></textarea>' +
        '<div class="row mt"><button class="btn p" data-act="useTyped">' + esc(tx('이 문장으로 연습', 'Practice this')) + '</button><button class="btn g" data-act="view" data-v="card">' + esc(tx('취소', 'Cancel')) + '</button></div>';
    }
    h += '<div class="row"><button class="btn" data-act="pick">🎯 ' + esc(tx('화면에서 고르기', 'Pick on page')) + '</button>' +
      '<button class="btn" data-act="view" data-v="list">📄 ' + esc(tx('이 페이지 문장', 'Page sentences')) + ' <b>' + ST.items.length + '</b></button>' +
      '<button class="btn" data-act="view" data-v="type">✏️</button></div>';
    if (ST.heard.length) h += '<div class="lbl">🔊 ' + esc(tx('방금 들은 문장', 'Just heard')) + '</div><div class="chips">' + ST.heard.map(function (t, i) { return '<button class="chip" data-act="useHeard" data-i="' + i + '" lang="' + LG.tts[0] + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    var r = ST.result && ST.result.text === ST.cur ? ST.result : null;
    h += '<div class="card"><div class="tt' + (ST.cur ? '' : ' ph') + '" lang="' + LG.tts[0] + '"' + (LANG === 'ar' ? ' dir="rtl"' : '') + '>' +
      (ST.cur ? (r && r.marks ? r.marks.map(function (m) { return m.p ? esc(m.t) : '<span class="w ' + (m.ok ? 'ok' : 'no') + '">' + esc(m.t) + '</span>'; }).join('') : esc(ST.cur))
        : esc(tx('🎯 화면의 ' + lname(LANG) + ' 문장을 누르거나, 마우스로 드래그해서 고르세요. 사이트에서 🔊 들은 문장도 여기 나타나요.', 'Click a ' + lname(LANG) + ' sentence on the page, select text, or use the list.'))) + '</div>';
    if (ST.cur) {
      var vs = Voice.forLang();
      h += '<div class="nav"><button class="btn s" data-act="say">🔊 ' + esc(tx('듣기', 'Listen')) + '</button><button class="btn s ' + (ST.slow ? 'on' : '') + '" data-act="slow">🐢 ' + esc(tx('천천히', 'Slow')) + '</button>' +
        (vs.length > 1 ? '<select data-ch="voice">' + vs.map(function (v) { var p = Voice.pick(); return '<option value="' + esc(v.name) + '"' + (p && p.name === v.name ? ' selected' : '') + '>' + esc(v.name.replace(/Microsoft |Google |Online \(Natural\)/g, '').slice(0, 26) + ' · ' + v.lang) + '</option>'; }).join('') + '</select>' : '') +
        '<span class="sp"></span>' + (ST.idx >= 0 ? '<button class="btn s g" data-act="prev">◀</button><small>' + (ST.idx + 1) + '/' + ST.items.length + '</small><button class="btn s g" data-act="next">▶</button>' : '') + '</div>';
      if (!Voice.forLang().length && synth) h += '<div class="note">' + esc(tx('이 기기에 ' + lname(LANG) + ' 음성이 없어요. Chrome 또는 Edge에서 더 자연스러운 음성을 들을 수 있어요.', 'No ' + lname(LANG) + ' voice on this device. Try Chrome or Edge.')) + '</div>';
    }
    h += '</div>';
    if (!ST.cur && ST.items.length) {
      var sug = ST.items.filter(function (it) { return normalize(it.text).length >= (CJK ? 2 : 4); }).slice(0, 8);
      if (sug.length) h += '<div class="lbl">✨ ' + esc(tx('이 페이지에서 바로 연습', 'Try from this page')) + '</div><div class="chips">' + sug.map(function (it) { return '<button class="chip" data-act="useItem" data-i="' + ST.items.indexOf(it) + '" lang="' + LG.tts[0] + '">' + esc(it.text) + '</button>'; }).join('') + '</div>';
    }
    if (ST.cur) {
      h += '<div class="mw"><button class="mic' + (ST.busy ? ' rec' : '') + '" data-act="mic" aria-label="mic">' + (ST.busy ? '<svg width="28" height="28" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="#fff"/></svg>' : '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" fill="#fff"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></svg>') + '</button>' +
        '<div class="hint">' + esc(ST.busy ? tx('듣고 있어요… 다 말하면 잠시 멈추거나 ⏹ 누르기', 'Listening… pause or press ⏹ when done')
          : (CAN_SR || CAN_AI) ? tx('누르고 문장을 소리 내어 말하면 자동으로 평가하고 녹음해요', 'Press and say the sentence — auto scoring + recording')
          : tx(LANG === 'la' ? '라틴어는 음성 인식이 없어요. 녹음 후 원어민과 비교해 스스로 평가해요' : '이 브라우저는 음성 인식이 안 돼요(Chrome 권장). 녹음 후 스스로 평가해요', 'No speech recognition here — record and self-check')) + '</div>' +
        '<div class="live">' + esc(ST.live || '') + '</div></div>';
    }
    if (r) h += vResult(r);
    return h;
  }
  function vResult(r) {
    var h = '<div class="card">';
    if (r.self) {
      if (r.stars) {
        h += '<div class="res"><div class="ring" style="--p:' + r.total + '"><span>' + r.stars + '★</span></div><div><b>' + esc(tx('스스로 평가 완료', 'Self-check saved')) + '</b>' + (r.xp != null ? '<br><span class="xp">+' + r.xp + ' XP</span>' : '') + '</div></div>';
      } else {
        h += '<b>' + esc(tx('🎧 내 녹음을 원어민 음성과 비교해 들어 보세요', '🎧 Compare your recording with the native voice')) + '</b>' +
          '<div class="row mt">' + (r.blob ? '<button class="btn" data-act="playMine">▶ ' + esc(tx('내 녹음', 'Mine')) + '</button><button class="btn" data-act="compare">🔁 ' + esc(tx('원어민 → 나', 'Native → me')) + '</button>' : '') + '</div>' +
          '<div class="muted mt">' + esc(tx('얼마나 비슷했나요?', 'How close was it?')) + '</div><div class="stars">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="star" data-v="' + n + '">' + n + '★</button>'; }).join('') + '</div>';
      }
      if (r.flu != null) h += '<div class="bars"><div class="bar"><span>' + esc(tx('유창성', 'Fluency')) + '</span><span class="t"><i style="width:' + r.flu + '%"></i></span><span>' + r.flu + '</span></div></div>';
    } else if (r.empty) {
      h += '<b>🙉 ' + esc(tx('잘 들리지 않았어요', "Couldn't hear you")) + '</b><div class="muted mt">' + esc(tx('마이크 가까이에서 또박또박 다시 말해 보세요.', 'Speak a little louder, close to the mic.')) + '</div>';
    } else {
      var col = r.total >= 85 ? '#16a34a' : r.total >= 70 ? '#e0a100' : '#e0386b';
      h += '<div class="res"><div class="ring" style="--p:' + r.total + ';--c:' + col + '"><span>' + r.total + '</span></div><div><span class="grade">' + gradeOf(r.total) + '</span><b>' + esc(praise(r.total)) + '</b>' +
        (r.xp != null ? '<br><span class="xp">+' + r.xp + ' XP</span>' : '') + (r.note ? '<div class="note">' + esc(r.note) + '</div>' : '') + '</div></div>';
      h += '<div class="bars">' + [[tx('정확도', 'Accuracy'), r.acc], [tx('완성도', 'Complete'), r.comp], [tx('유창성', 'Fluency'), r.flu]].filter(function (b) { return b[1] != null; }).map(function (b) {
        return '<div class="bar"><span>' + esc(b[0]) + '</span><span class="t"><i style="width:' + b[1] + '%"></i></span><span>' + b[1] + '</span></div>'; }).join('') + '</div>';
      h += '<div class="heard">🗣 ' + esc(tx('들린 말: ', 'Heard: ')) + '<b lang="' + LG.tts[0] + '">' + esc(r.heard || '—') + '</b>' + (r.via === 'ai' ? ' <small>· 🧠 ' + esc(tx('AI 분석', 'AI')) + '</small>' : '') + '</div>';
    }
    if (r.aiFail) h += '<div class="note">' + esc(tx('🧠 발음 분석기를 불러오지 못했어요(인터넷 · 학교 방화벽 확인).', 'Could not load the AI analyzer (check network/firewall).')) + '</div>';
    h += '<div class="row mt">' + (r.blob && !(r.self && !r.stars) ? '<button class="btn s" data-act="playMine">▶ ' + esc(tx('내 녹음', 'Mine')) + '</button><button class="btn s" data-act="compare">🔁 ' + esc(tx('원어민 → 나', 'Native → me')) + '</button><button class="btn s" data-act="dl">⬇ ' + esc(tx('저장', 'Save')) + '</button>' : '') +
      (ST.idx >= 0 && ST.idx < ST.items.length - 1 ? '<button class="btn s a" data-act="next">' + esc(tx('다음 문장 ▶', 'Next ▶')) + '</button>' : '') + '</div>';
    if (!ST.user && !r.self) h += '<div class="muted mt">💡 ' + esc(tx('로그인하면 점수가 반 순위와 전체 리그에 올라가요 → [우리 반] 탭', 'Sign in to send scores to your class and the league → Class tab')) + '</div>';
    return h + '</div>';
  }
  function vList() {
    var h = '<div class="row"><button class="btn s" data-act="view" data-v="card">← ' + esc(tx('돌아가기', 'Back')) + '</button><button class="btn s g" data-act="rescan">↻ ' + esc(tx('다시 찾기', 'Rescan')) + '</button></div>' +
      '<input class="mt" type="search" name="q" placeholder="' + esc(tx('검색', 'Search')) + '" value="' + esc(ST.q) + '"><div class="list" id="lst"></div>';
    setTimeout(renderList, 0);
    return h;
  }
  function renderList() {
    var box = R.querySelector('#lst'); if (!box) return;
    var q = normalize(ST.q), n = 0;
    var html = ST.items.map(function (it, i) {
      if (q && normalize(it.text).indexOf(q) < 0) return '';
      if (++n > 200) return '';
      var b = S.best[hash(LANG + '|' + normalize(it.text))];
      return '<button class="it" data-act="useItem" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span lang="' + LG.tts[0] + '"' + (LANG === 'ar' ? ' dir="rtl"' : '') + '>' + esc(it.text) + '</span>' + (b != null ? '<span class="b">' + b + '</span>' : '') + '</button>';
    }).join('');
    box.innerHTML = html || '<div class="muted c mt">' + esc(tx('이 페이지에서 ' + lname(LANG) + ' 문장을 찾지 못했어요. 다른 화면으로 이동하거나 ✏️ 직접 입력해 보세요.', 'No ' + lname(LANG) + ' sentences found on this page.')) + '</div>';
  }

  /* 내 기록 */
  function vMe() {
    var lv = lvlOf(S.xp), a = xpAt(lv), b = xpAt(lv + 1), W = weekKey(), t = tierOf(S.wk[W] || 0);
    var h = '<div class="lvc"><div class="row"><b>Lv.' + lv + ' ' + esc(titleOf(lv)) + '</b><span style="margin-left:auto;font-weight:800">' + S.xp + ' XP</span></div><div class="pg"><i style="width:' + clamp((S.xp - a) / (b - a) * 100, 0, 100) + '%"></i></div>' +
      '<div style="font-size:12px;opacity:.8;margin-top:6px">' + esc(tx('다음 레벨까지 ', 'To next level ')) + (b - S.xp) + ' XP · ' + esc(tx('이번 주 ', 'This week ')) + (S.wk[W] || 0) + ' XP <span class="tier" style="background:' + t.color + '">' + esc(t.name) + '</span></div></div>';
    h += '<div class="stat"><div><b>' + S.attempts + '</b><small>' + esc(tx('말하기 횟수', 'Attempts')) + '</small></div><div><b>' + (S.attempts ? Math.round(S.sumScore / S.attempts) : 0) + '</b><small>' + esc(tx('평균 점수', 'Avg score')) + '</small></div>' +
      '<div><b>' + S.perfect + '</b><small>' + esc(tx('완벽 발음(95+)', 'Perfect (95+)')) + '</small></div><div><b>' + (S.streak || 0) + esc(tx('일', 'd')) + '</b><small>' + esc(tx('연속 학습', 'Streak')) + '</small></div></div>';
    h += '<div class="lbl">🏅 ' + esc(tx('배지', 'Badges')) + ' ' + S.badges.length + '/' + BADGES.length + '</div><div class="bg">' + BADGES.map(function (bd) {
      var on = S.badges.indexOf(bd[0]) >= 0; return '<div class="' + (on ? '' : 'off') + '" title="' + esc(bd[4]) + '"><span>' + bd[1] + '</span>' + esc(UIK ? bd[2] : bd[3]) + '</div>'; }).join('') + '</div>';
    h += '<div class="lbl">🎧 ' + esc(tx('내 녹음 (이 기기에만 저장)', 'My recordings (this device only)')) + '</div><div class="seg"><button class="' + (ST.recFilter === 'site' ? 'on' : '') + '" data-act="recf" data-v="site">' + esc(tx('이 사이트', 'This site')) + '</button><button class="' + (ST.recFilter === 'all' ? 'on' : '') + '" data-act="recf" data-v="all">' + esc(tx('전체', 'All')) + '</button></div>';
    if (ST.recs === 'loading' || ST.recs == null) h += '<div class="muted mt">…</div>';
    else {
      var list = ST.recs.filter(function (r) { return ST.recFilter === 'all' || r.site === SITE; }).slice(0, 60);
      h += list.length ? list.map(function (r) {
        return '<div class="rec"><button class="btn s" data-act="playRec" data-id="' + esc(r.id) + '">▶</button><div class="t" lang="' + esc(r.lang) + '">' + esc(r.text) + '<small>' + fmtDate(r.ts) + (ST.recFilter === 'all' ? ' · ' + esc(r.site) : '') + '</small></div><span class="sc">' + (r.score != null ? r.score : r.stars ? r.stars + '★' : '') + '</span>' +
          '<button class="btn s g" data-act="useRec" data-id="' + esc(r.id) + '" title="' + esc(tx('다시 연습', 'Practice again')) + '">↺</button><button class="btn s g" data-act="dlRec" data-id="' + esc(r.id) + '">⬇</button><button class="btn s g" data-act="delRec" data-id="' + esc(r.id) + '">🗑</button></div>';
      }).join('') : '<div class="muted mt">' + esc(tx('아직 녹음이 없어요. 🎙 연습 탭에서 말해 보세요!', 'No recordings yet.')) + '</div>';
    }
    h += '<div class="row mt"><button class="btn s g" data-act="mini">' + esc(ST.mini ? tx('말하기 버튼 크게', 'Bigger button') : tx('말하기 버튼 작게', 'Smaller button')) + '</button></div>';
    return h;
  }

  /* 로그인 카드 */
  function vLogin(why) {
    var h = '<div class="card c"><div style="font-size:34px">🏆</div><b>' + esc(why) + '</b><div class="muted mt">' + esc(tx('다인에듀 사이트 계정으로 로그인하면 모든 어학 사이트에서 점수가 이어져요.', 'One account for all Dain Edu language sites.')) + '</div>';
    if (FB && FB.err) return h + '<div class="msg">' + esc(tx('서버 설정을 불러오지 못했어요.', 'Server not available.')) + '</div></div>';
    if (ST.unverified) {
      return h + '<div class="msg ok">' + esc(tx('이메일 인증이 필요해요: ', 'Please verify your email: ') + (ST.unverified.email || '')) + '</div><div class="row mt" style="justify-content:center"><button class="btn p" data-act="verified">' + esc(tx('인증 완료했어요', 'I have verified')) + '</button><button class="btn" data-act="resend">' + esc(tx('메일 다시 보내기', 'Resend')) + '</button><button class="btn g" data-act="logout">' + esc(tx('로그아웃', 'Sign out')) + '</button></div>' + (ST.msg ? '<div class="msg">' + esc(ST.msg) + '</div>' : '') + '</div>';
    }
    h += '<button class="btn p w100 mt" data-act="google">G&nbsp; ' + esc(tx('Google 계정으로 로그인', 'Continue with Google')) + '</button>' +
      '<div class="seg mt"><button class="' + (ST.authTab === 'in' ? 'on' : '') + '" data-act="authTab" data-v="in">' + esc(tx('이메일 로그인', 'Email sign-in')) + '</button><button class="' + (ST.authTab === 'up' ? 'on' : '') + '" data-act="authTab" data-v="up">' + esc(tx('처음이에요(가입)', 'Sign up')) + '</button></div>' +
      (ST.authTab === 'up' ? '<input class="mt" type="text" name="nm" maxlength="20" placeholder="' + esc(tx('이름(순위표에 표시)', 'Display name')) + '">' : '') +
      '<input class="mt" type="email" name="em" placeholder="' + esc(tx('이메일', 'Email')) + '" autocomplete="email"><input class="mt" type="password" name="pw" placeholder="' + esc(tx('비밀번호 (6자 이상)', 'Password (6+)')) + '" data-enter="email">' +
      '<button class="btn a w100 mt" data-act="email">' + esc(ST.authTab === 'up' ? tx('가입하기', 'Create account') : tx('로그인', 'Sign in')) + '</button>' + (ST.msg ? '<div class="msg">' + esc(ST.msg) + '</div>' : '');
    return h + '</div>';
  }

  /* 우리 반 */
  function vClass() {
    if (!ST.user) return vLogin(tx('반에 들어가 친구들과 경쟁해요', 'Join a class and compete'));
    var h = '';
    if (ST.clsSel) return vClassDetail(ST.clsSel);
    h += '<div class="row"><span class="muted" style="flex:1">👤 <b style="color:#1f2433">' + esc(myName()) + '</b></span><button class="btn s g" data-act="rename">✏️ ' + esc(tx('이름', 'Name')) + '</button><button class="btn s g" data-act="logout">↩︎ ' + esc(tx('로그아웃', 'Sign out')) + '</button></div>';
    if (ST.renaming) h += '<div class="row mt"><input type="text" name="newname" maxlength="20" value="' + esc(myName()) + '" style="flex:1" data-enter="saveName"><button class="btn p" data-act="saveName">' + esc(tx('저장', 'Save')) + '</button></div>';
    h += '<div class="lbl">👥 ' + esc(tx('내 반', 'My classes')) + '</div>';
    h += S.classes.length ? S.classes.map(function (c) {
      var d = ST.classes[c]; return '<button class="cl" data-act="openCls" data-v="' + c + '"><span style="font-size:22px">' + (d && LANGS[d.lang] ? LANGS[d.lang].flag : '🌐') + '</span><span><b>' + esc(d ? d.name : c) + '</b><small>' + (d ? esc((d.lang === 'all' ? tx('모든 언어', 'All languages') : lname(d.lang)) + (d.owner === ST.user.uid ? tx(' · 내가 만든 반', ' · owner') : ' · ' + tx('담당 ', 'by ') + (d.ownerName || ''))) : '…') + '</small></span><span class="code">' + c + '</span></button>';
    }).join('') : '<div class="muted">' + esc(tx('아직 들어간 반이 없어요. 선생님께 받은 반 코드를 입력하거나 새 반을 만들어 보세요.', 'No class yet. Enter a code from your teacher or create one.')) + '</div>';
    h += '<div class="lbl">🔑 ' + esc(tx('반 코드로 들어가기', 'Join with a code')) + '</div><div class="row"><input type="text" name="code" maxlength="6" placeholder="ABC123" style="flex:1;text-transform:uppercase;font-family:ui-monospace,monospace" data-enter="join"><button class="btn p" data-act="join">' + esc(tx('들어가기', 'Join')) + '</button></div>';
    h += '<div class="lbl">✨ ' + esc(tx('새 반 만들기', 'Create a class')) + '</div><input type="text" name="cname" maxlength="40" placeholder="' + esc(tx('예: KCIS 스페인어 1반', 'e.g. Spanish 1A')) + '">' +
      '<div class="row mt"><select name="clang" style="max-width:none;flex:1"><option value="' + LANG + '">' + LG.flag + ' ' + esc(lname(LANG)) + tx(' 연습만 집계', ' only') + '</option><option value="all">🌐 ' + esc(tx('모든 언어 집계', 'All languages')) + '</option></select><button class="btn a" data-act="create">' + esc(tx('만들기', 'Create')) + '</button></div>';
    if (ST.msg) h += '<div class="msg">' + esc(ST.msg) + '</div>';
    if (ST.cloudErr) h += '<div class="msg">' + esc(tx('서버 저장 오류: ', 'Sync error: ') + ST.cloudErr) + '</div>';
    return h;
  }
  function vClassDetail(code) {
    var d = ST.classes[code] || {}, own = d.owner === ST.user.uid, W = weekKey();
    var h = '<div class="row"><button class="btn s" data-act="clsBack">← ' + esc(tx('내 반', 'My classes')) + '</button><span class="sp" style="flex:1"></span><button class="btn s g" data-act="reloadCls">↻</button></div>';
    h += '<div class="card"><div class="row"><span style="font-size:26px">' + (LANGS[d.lang] ? LANGS[d.lang].flag : '🌐') + '</span><div style="flex:1"><b style="font-size:16px">' + esc(d.name || code) + '</b><div class="muted">' + esc(d.lang === 'all' ? tx('모든 언어', 'All languages') : lname(d.lang)) + ' · ' + esc(tx('담당 ', 'by ') + (d.ownerName || '')) + '</div></div><span class="code" style="font:800 15px ui-monospace,monospace;background:#f1ebe0;border-radius:9px;padding:6px 9px">' + code + '</span></div>' +
      '<div class="row mt"><button class="btn s" data-act="copyCode" data-v="' + code + '">📋 ' + esc(tx('반 코드 복사', 'Copy code')) + '</button><button class="btn s" data-act="copyLink" data-v="' + code + '">🔗 ' + esc(tx('초대 링크 복사', 'Copy invite link')) + '</button></div></div>';
    h += '<div class="seg mt"><button class="' + (ST.clsMode !== 'all' ? 'on' : '') + '" data-act="clsMode" data-v="week">' + esc(tx('이번 주', 'This week')) + '</button><button class="' + (ST.clsMode === 'all' ? 'on' : '') + '" data-act="clsMode" data-v="all">' + esc(tx('전체 누적', 'All time')) + '</button></div>';
    if (ST.members === 'loading' || ST.members == null) h += '<div class="muted mt c">…</div>';
    else {
      var rows = ST.members.map(function (m) { var v = ST.clsMode === 'all' ? (m.xp || 0) : ((m.wk || {})[W] || 0); return { m: m, v: v }; }).sort(function (a, b) { return b.v - a.v || (b.m.xp || 0) - (a.m.xp || 0); });
      h += rows.length ? '<div class="lb">' + rows.map(function (r, i) {
        var m = r.m, avg = m.attempts ? Math.round((m.sumScore || 0) / m.attempts) : 0;
        return '<div class="lr' + (m.uid === ST.user.uid ? ' me' : '') + '"><span class="rk">' + (['🥇', '🥈', '🥉'][i] || (i + 1)) + '</span><span class="nm">' + esc(m.name || '?') + '<small>Lv.' + (m.lvl || 1) + ' · ' + tx('평균 ', 'avg ') + avg + tx('점 · 🔥', ' · 🔥') + (m.streak || 0) + tx('일', 'd') + ' · ' + (m.attempts || 0) + tx('회', ' tries') + '</small></span><span class="v">' + r.v + '<small>XP</small>' +
          (own && m.uid !== ST.user.uid ? '<button class="btn s g" data-act="kick" data-v="' + esc(m.uid) + '" title="' + esc(tx('내보내기', 'Remove')) + '">✕</button>' : '') + '</span></div>'; }).join('') + '</div>'
        : '<div class="muted mt">' + esc(tx('아직 멤버가 없어요. 반 코드를 공유하세요!', 'No members yet. Share the code!')) + '</div>';
    }
    h += '<div class="row mt">' + (S.classes.indexOf(code) >= 0 ? '<button class="btn s g" data-act="leave" data-v="' + code + '">' + esc(tx('반 나가기', 'Leave class')) + '</button>' : '') + (own ? '<button class="btn s g" data-act="delCls" data-v="' + code + '" style="color:#b3123a">' + esc(tx('반 삭제', 'Delete class')) + '</button>' : '') +
      '<a class="btn s g" href="' + BASE + 'speak.html#class=' + code + '" target="_blank" rel="noopener">📋 ' + esc(tx('선생님용 표 보기', 'Teacher view')) + '</a></div>';
    if (ST.msg) h += '<div class="msg">' + esc(ST.msg) + '</div>';
    return h;
  }

  /* 리그 */
  function vLeague() {
    if (!ST.user) return vLogin(tx('전체 리그에서 다른 학생들과 경쟁해요', 'Compete in the league'));
    var W = weekKey(), t = tierOf(S.wk[W] || 0);
    var h = '<div class="card" style="margin-top:0"><div class="row"><span class="tier" style="background:' + t.color + '">🏆 ' + esc(t.name) + '</span><span class="muted" style="flex:1">' + esc(tx('이번 주 ', 'This week ')) + '<b style="color:#1f2433">' + (S.wk[W] || 0) + ' XP</b></span></div>' +
      '<div class="muted mt" style="font-size:11.5px">' + TIERS.map(function (r) { return (UIK ? r[1] : r[2]) + ' ' + r[0] + '+'; }).join(' · ') + ' · ' + esc(tx('매주 월요일 새 시즌', 'New season every Monday')) + '</div></div>';
    h += '<div class="seg mt">' + [['week', tx('이번 주', 'This week')], ['lang', LG.flag + ' ' + lname(LANG)], ['all', tx('전체 누적', 'All time')]].map(function (m) {
      return '<button class="' + (ST.leagueMode === m[0] ? 'on' : '') + '" data-act="leagueMode" data-v="' + m[0] + '">' + esc(m[1]) + '</button>'; }).join('') + '</div>';
    var L = ST.league;
    if (!L || !L.rows) h += '<div class="muted mt c">…</div>';
    else if (L.err) h += '<div class="msg">' + esc(tx('순위를 불러오지 못했어요: ', 'Could not load: ') + L.err) + '</div>';
    else {
      h += L.rows.length ? '<div class="lb">' + L.rows.map(function (x, i) {
        var langs = Object.keys(x.lx || {}).filter(function (k) { return x.lx[k] > 0; }).map(function (k) { return LANGS[k] ? LANGS[k].flag : ''; }).join('');
        return '<div class="lr' + (x.uid === ST.user.uid ? ' me' : '') + '"><span class="rk">' + (['🥇', '🥈', '🥉'][i] || (i + 1)) + '</span><span class="nm">' + esc(x.name || '?') + '<small>Lv.' + (x.lvl || lvlOf(x.xp)) + ' ' + esc(titleOf(x.lvl || lvlOf(x.xp))) + ' ' + langs + '</small></span><span class="v">' + x.v + '<small>XP</small></span></div>'; }).join('') + '</div>'
        : '<div class="muted mt c">' + esc(tx('아직 기록이 없어요. 첫 번째 주인공이 되어 보세요!', 'No scores yet — be the first!')) + '</div>';
      if (L.me) h += '<div class="lr me mt"><span class="rk">' + L.me + '</span><span class="nm">' + esc(myName()) + '</span><span class="v">' + esc(tx('내 순위', 'My rank')) + '</span></div>';
    }
    h += '<div class="row mt"><button class="btn s g" data-act="reloadLeague">↻ ' + esc(tx('새로고침', 'Refresh')) + '</button><a class="btn s g" href="' + BASE + 'speak.html" target="_blank" rel="noopener">🏆 ' + esc(tx('리그 전체 화면', 'Full league page')) + '</a></div>';
    return h;
  }

  /* ---------------- 동작 ---------------- */
  function setCur(text, idx) { ST.cur = String(text || '').trim().slice(0, 300) || null; ST.idx = idx == null ? -1 : idx; ST.result = null; ST.live = ''; ST.view = 'card'; ST.tab = 'practice'; }
  function onChange(e) {
    var t = e.target;
    if (t.dataset.ch === 'voice') { LSset('dspk:voice:' + LANG, t.value); Voice.say(ST.cur); }
  }
  function onClick(e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    e.preventDefault(); act(b.dataset.act, b);
  }
  function val(n) { var el = R.querySelector('[name="' + n + '"]'); return el ? el.value : ''; }
  function playBlob(blob, after) {
    if (!blob) return; try { var u = URL.createObjectURL(blob), au = new Audio(u); au.onended = function () { URL.revokeObjectURL(u); after && after(); }; au.play().catch(function () {}); } catch (e) {}
  }
  function download(blob, text, mime) {
    var ext = /mp4|m4a|aac/.test(mime || '') ? 'm4a' : /ogg/.test(mime || '') ? 'ogg' : 'webm';
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ('speak_' + SITE + '_' + String(text).replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 30) + '.' + ext);
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function act(a, b) {
    var v = b && b.dataset ? b.dataset.v : null;
    switch (a) {
      case 'close': openPanel(false); break;
      case 'tab': ST.tab = v; ST.msg = ''; if (v === 'me') ST.recs = null; if (v === 'practice') ST.view = 'card'; render(); break;
      case 'view': ST.view = v; if (v === 'list') ST.items = scanPage(); render(); break;
      case 'rescan': ST.items = scanPage(); render(); break;
      case 'pick': pickMode(true); break;
      case 'pickOff': pickMode(false); break;
      case 'useItem': var i = +b.dataset.i; setCur(ST.items[i].text, i); try { ST.items[i].el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) {} render(); Voice.say(ST.cur); break;
      case 'useHeard': setCur(ST.heard[+b.dataset.i]); render(); break;
      case 'useTyped': var tv = val('typed').trim(); if (tv) { setCur(tv); render(); } break;
      case 'say': Voice.say(ST.cur); break;
      case 'slow': ST.slow = !ST.slow; render(); Voice.say(ST.cur); break;
      case 'prev': if (ST.idx > 0) { setCur(ST.items[ST.idx - 1].text, ST.idx - 1); render(); Voice.say(ST.cur); } break;
      case 'next': if (ST.idx < ST.items.length - 1) { setCur(ST.items[ST.idx + 1].text, ST.idx + 1); render(); Voice.say(ST.cur); } break;
      case 'mic': startAttempt(); break;
      case 'ipClose': if (A && A.inline === POP.chip) cancelAttempt(); closePop(); break;
      case 'ipStop': if (A && A.inline) stopAttempt(); break;
      case 'ipSay': Voice.say(POP.chip ? chipText(POP.chip) : ST.cur); break;
      case 'ipAgain': if (POP.chip) chipClick(POP.chip); break;
      case 'ipMore': var pc0 = POP.chip, keep = ST.result; closePop(); if (pc0) setCur(chipText(pc0)); if (keep && keep.text === ST.cur) ST.result = keep; openPanel(true); render(); break;
      case 'playMine': if (ST.result) playBlob(ST.result.blob); break;
      case 'compare': if (ST.result) Voice.say(ST.result.text, null, function () { setTimeout(function () { playBlob(ST.result && ST.result.blob); }, 300); }); break;
      case 'dl': if (ST.result && ST.result.blob) download(ST.result.blob, ST.result.text, ST.result.mime); break;
      case 'star':
        if (ST.result && ST.result.self && !ST.result.stars) {
          var st = +v, tot = st * 20; ST.result.stars = st; ST.result.total = tot; award(tot, true, ST.result.text);
          var rid0 = ST.result.id; IDB.get(rid0).then(function (o) { if (o) { o.stars = st; IDB.add(o); } }); render(); if (POP.chip) popResult();
        } break;
      case 'recf': ST.recFilter = v; render(); break;
      case 'playRec': IDB.get(b.dataset.id).then(function (o) { if (o) playBlob(o.blob); }); break;
      case 'dlRec': IDB.get(b.dataset.id).then(function (o) { if (o) download(o.blob, o.text, o.mime); }); break;
      case 'delRec': IDB.del(b.dataset.id).then(function () { ST.recs = null; render(); }); break;
      case 'useRec': IDB.get(b.dataset.id).then(function (o) { if (o) { setCur(o.text); render(); } }); break;
      case 'mini': ST.mini = !ST.mini; LSset('dspk:mini', ST.mini); R.querySelector('.fab').classList.toggle('mini', ST.mini); render(); break;
      case 'google': login('google'); break;
      case 'email': case 'authTab':
        if (a === 'authTab') { ST.authTab = v; ST.msg = ''; render(); break; }
        var em = val('em').trim(), pw = val('pw'), nm = val('nm').trim();
        if (!em || !pw) { ST.msg = tx('이메일과 비밀번호를 입력하세요', 'Enter email and password'); render(); break; }
        login(ST.authTab, em, pw, nm); break;
      case 'verified': if (ST.unverified) ST.unverified.reload().then(function () { return ST.unverified.getIdToken(true); }).then(function () { onUser(FB.auth.currentUser); }); break;
      case 'resend': if (ST.unverified) FB.Au.sendEmailVerification(ST.unverified).then(function () { ST.msg = tx('인증 메일을 다시 보냈어요', 'Sent again'); render(); }); break;
      case 'logout': flush(); FB.Au.signOut(FB.auth); break;
      case 'rename': ST.renaming = !ST.renaming; render(); break;
      case 'saveName': ST.renaming = false; saveName(val('newname')); break;
      case 'join': joinClass(val('code')); break;
      case 'create': createClass(val('cname'), val('clang')); break;
      case 'openCls': ST.clsSel = v; ST.members = null; ST.msg = ''; render(); break;
      case 'clsBack': ST.clsSel = null; ST.members = null; ST.msg = ''; render(); break;
      case 'reloadCls': ST.members = null; render(); break;
      case 'clsMode': ST.clsMode = v; render(); break;
      case 'copyCode': copy(v); break;
      case 'copyLink': copy(location.origin + location.pathname + '?speakClass=' + v); break;
      case 'kick': if (confirmIn(tx('이 학생을 반에서 내보낼까요?', 'Remove this student?'))) kick(ST.clsSel, v); break;
      case 'leave': if (confirmIn(tx('이 반에서 나갈까요? 반 점수는 사라져요.', 'Leave this class? Class points will be lost.'))) leaveClass(v); break;
      case 'delCls': if (confirmIn(tx('반을 삭제할까요? 멤버 기록도 모두 지워져요.', 'Delete this class and all member records?'))) removeClass(v); break;
      case 'leagueMode': ST.leagueMode = v; ST.league = null; render(); break;
      case 'reloadLeague': ST.league = null; render(); break;
      case 'selPractice': var s1 = ST.selT; hideSel(); if (s1) { setCur(s1); openPanel(true); render(); Voice.say(s1); } break;
      case 'selSay': if (ST.selT) Voice.say(ST.selT); break;
    }
  }
  /* 확인: 버튼을 한 번 더 누르면 실행 (브라우저 대화상자를 쓰지 않음) */
  var confirmState = { k: null, t: 0 };
  function confirmIn(q) { var now = Date.now(); if (confirmState.k === q && now - confirmState.t < 4000) { confirmState.k = null; return true; } confirmState = { k: q, t: now }; toast(q + ' ' + tx('(한 번 더 누르면 실행)', '(tap again to confirm)')); return false; }
  function copy(t) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast(tx('복사했어요: ', 'Copied: ') + t); }, function () { toast(t); }); }

  /* ---------------- 화면에서 고르기 ---------------- */
  var picking = false, hoverEl = null;
  function pickMode(on) {
    picking = on; R.querySelector('.pickbar').classList.toggle('on', on);
    if (on) { R.querySelector('.pn').classList.remove('on'); R.querySelector('.fab').style.display = 'none'; }
    else { box(null); if (ST.open) R.querySelector('.pn').classList.add('on'); else R.querySelector('.fab').style.display = ''; }
  }
  function candidate(el) {
    for (var e = el, k = 0; e && e !== document.body && k < 4; e = e.parentElement, k++) {
      if (e === HOST || skipEl(e)) return null;
      var b = blockOf(e); if (!b || b === document.body) return null;
      var g = textsUnder(b).get(b); var runs = g ? extract(g.join(' ')) : [];
      if (runs.length) return { el: b, runs: runs };
      e = b;
    }
    return null;
  }
  function box(el) {
    var bx = R.querySelector('.box'); if (!bx) return;
    if (!el) { bx.classList.remove('on'); return; }
    var r = el.getBoundingClientRect(); bx.style.left = (r.left - 4) + 'px'; bx.style.top = (r.top - 3) + 'px'; bx.style.width = (r.width + 8) + 'px'; bx.style.height = (r.height + 6) + 'px'; bx.classList.add('on');
  }
  document.addEventListener('mouseover', function (e) { if (!picking) return; var c = candidate(e.target); hoverEl = c ? c.el : null; box(hoverEl); }, true);
  document.addEventListener('click', function (e) {
    if (!picking) return;
    if (e.composedPath && e.composedPath().indexOf(HOST) >= 0) return;
    e.preventDefault(); e.stopPropagation();
    var c = candidate(e.target);
    if (!c) { toast(tx(lname(LANG) + ' 문장이 아니에요. 다른 곳을 눌러 보세요', 'Not a ' + lname(LANG) + ' sentence')); return; }
    var pickT = c.runs[0];
    try { /* 누른 위치의 문장 고르기 */
      var rg = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null, cp = !rg && document.caretPositionFromPoint ? document.caretPositionFromPoint(e.clientX, e.clientY) : null;
      var node = rg ? rg.startContainer : cp ? cp.offsetNode : null;
      if (node && node.nodeType === 3) { var own = extract(node.nodeValue); if (own.length) { pickT = own[0]; var best = c.runs.filter(function (r) { return r.indexOf(own[0]) >= 0; })[0]; if (best) pickT = best; } }
    } catch (x) {}
    pickMode(false);
    var idx = -1; ST.items = scanPage(); var nk = normalize(pickT); ST.items.some(function (it, i) { if (normalize(it.text) === nk) { idx = i; return true; } });
    setCur(pickT, idx); openPanel(true); render(); Voice.say(pickT);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && picking) pickMode(false);
    if (e.altKey && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) { e.preventDefault(); openPanel(!ST.open); }
  });

  /* 드래그 선택 → 따라 말하기 */
  function selText() { var s = window.getSelection ? String(window.getSelection()) : ''; s = s.trim(); if (!s || s.length > 300) return ''; var r = extract(s); return r.length ? (r.length === 1 ? r[0] : s) : ''; }
  function hideSel() { var el = R.querySelector('.sel'); if (el) el.classList.remove('on'); }
  document.addEventListener('mouseup', function (e) {
    if (picking || (e.composedPath && e.composedPath().indexOf(HOST) >= 0)) return;
    setTimeout(function () {
      var t = selText(), el = R.querySelector('.sel'); if (!el) return;
      if (!t) { el.classList.remove('on'); return; }
      ST.selT = t;
      var rg = window.getSelection().getRangeAt(0).getBoundingClientRect();
      el.style.left = clamp(rg.left + rg.width / 2 - 70, 8, window.innerWidth - 160) + 'px'; el.style.top = Math.max(8, rg.top - 46) + 'px'; el.classList.add('on');
    }, 10);
  });
  document.addEventListener('scroll', hideSel, true);

  /* ---------------- 🎙 문장마다 말하기 버튼 (인라인) ----------------
     화면의 문장 끝마다 작은 🎙 버튼을 붙여요. 누르면 바로 녹음 → 자동 평가 → 그 자리에서 결과 카드.
     기본: 스페인어 사이트. 끄기/켜기: 가드 줄에 data-speak-inline="off|on", 전체 설정 options.speakInline: ['es', ...] */
  var INL = (function () {
    var a = attr('data-inline'); if (a === 'off') return false; if (a === 'on') return true;
    var o = (window.SMC_CONFIG && window.SMC_CONFIG.options) || {};
    if (o.speakInline === false) return false;
    var langs = Array.isArray(o.speakInline) ? o.speakInline : ['es'];
    try { var pc = JSON.parse(localStorage.getItem('smc:site:' + SITE) || 'null'); if (pc && pc.speakInline === false) return false; } catch (e) {}
    return langs.indexOf(LANG) >= 0 && !!(window.customElements && document.documentElement.attachShadow);
  })();
  var CHIP_CSS = ':host{display:inline-block;vertical-align:middle;margin:0 1px 0 5px;line-height:1;font-size:12px;white-space:nowrap;text-indent:0;letter-spacing:normal;text-transform:none;font-style:normal;text-decoration:none}' +
    'button{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:3px;height:22px;min-width:22px;padding:0 5px;border-radius:999px;cursor:pointer;background:#fff1f4;border:1px solid #f3b3c4;color:#c2185b;font:700 11.5px/1 system-ui,-apple-system,"Malgun Gothic","Apple SD Gothic Neo",sans-serif;transition:background .15s,color .15s;-webkit-tap-highlight-color:transparent}' +
    'button:hover{background:#e0386b;color:#fff;border-color:#e0386b}button:focus-visible{outline:2px solid #e0386b;outline-offset:2px}' +
    'svg{width:12px;height:12px;flex:none}' +
    'button.rec{background:#c8102e;color:#fff;border-color:#c8102e;animation:p 1.1s infinite}@keyframes p{0%{box-shadow:0 0 0 0 rgba(200,16,46,.5)}70%{box-shadow:0 0 0 7px rgba(200,16,46,0)}100%{box-shadow:0 0 0 0 rgba(200,16,46,0)}}' +
    'button.busy{background:#fff7df;border-color:#e8b74a;color:#8a6d1d}' +
    'button.s1{background:#e6f7ee;border-color:#8fd3ae;color:#0b6b3a}button.s2{background:#fff6dc;border-color:#ecc76a;color:#8a5a00}button.s3{background:#ffe9ed;border-color:#f3a3b5;color:#b3123a}' +
    'button.s1:hover,button.s2:hover,button.s3:hover{background:#e0386b;color:#fff;border-color:#e0386b}' +
    '@media print{:host{display:none}}';
  var MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>';
  function bestOf(t) { return S.best[hash(LANG + '|' + normalize(t))]; }
  function chipText(el) { return el.__dspkText || el.getAttribute('data-text') || ''; }
  function paintChip(el) {
    var b = el.shadowRoot && el.shadowRoot.querySelector('button'); if (!b) return;
    var st = el.__dspkState || '', best = bestOf(chipText(el));
    b.className = st ? st : best == null ? '' : best >= 85 ? 's1' : best >= 70 ? 's2' : 's3';
    b.innerHTML = st === 'rec' ? '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>' : st === 'busy' ? '…' : MIC_SVG + (best != null ? '<b>' + best + '</b>' : '');
    b.title = st === 'rec' ? tx('멈추기', 'Stop') : tx('🎙 따라 말하기 — 녹음하고 바로 평가해요', '🎙 Say it — record & score') + (best != null ? ' (' + tx('최고 ', 'best ') + best + ')' : '');
    b.setAttribute('aria-label', tx('따라 말하기: ', 'Say: ') + chipText(el));
  }
  function chipState(el, st) { if (!el) return; el.__dspkState = st; paintChip(el); }
  if (INL) {
    var DspkMic = function () { return Reflect.construct(HTMLElement, [], DspkMic); };
    DspkMic.prototype = Object.create(HTMLElement.prototype); DspkMic.prototype.constructor = DspkMic; Object.setPrototypeOf(DspkMic, HTMLElement);
    DspkMic.prototype.connectedCallback = function () {
      var self = this;
      if (!self.shadowRoot) {
        var r = self.attachShadow({ mode: 'open' });
        r.innerHTML = '<style>' + CHIP_CSS + '</style><button type="button"></button>';
        var b = r.querySelector('button');
        var stop = function (e) { e.stopPropagation(); };
        ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown', 'keyup', 'dblclick'].forEach(function (ev) { b.addEventListener(ev, stop); });
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); chipClick(self); });
      }
      self.setAttribute('translate', 'no'); self.classList.add('notranslate');
      paintChip(self);
    };
    try { if (!customElements.get('dspk-mic')) customElements.define('dspk-mic', DspkMic); } catch (e) { INL = false; }
  }

  /* 문장 찾기 → 🎙 붙이기
     ① 🔊 버튼·data-say 문장: 사이트가 읽어 주는 바로 그 문장 옆에
     ② 그 밖의 화면 문장: 문장 끝마다 (제목·메뉴·단어 나열·빈칸 문제는 제외) */
  var NOCHIP = 'button,a,label,select,option,textarea,input,summary,h1,h2,th,nav,header,footer,[role=button],[role=option],[role=tab],[role=menuitem],[role=navigation],[draggable=true],[contenteditable=""],[contenteditable=true],[data-dspk-a],.dh-bar,dspk-mic,#dspk-host,#smc-badge,#smc-ov';
  var TITLE_CLS = {}; 'title ttl head heading hero brand logo badge chip tag nav menu breadcrumb crumb toc tab tabs btn button caption meta kicker eyebrow subtitle subhead legend foot footer header top topbar sidebar side tlink lcard card-title pill progress score stat stats hub'.split(' ').forEach(function (k) { TITLE_CLS[k] = 1; });
  var QUIZ_CLS = /(^|[\s_-])(opt|opts|option|options|choice|choices|answer|answers|ans|quiz-opt|mcq|bank|chip|token|tile|drag|drop|blank)([\s_-]|$)/i;
  var MAX_CHIPS = 1500, chipSig = new WeakMap(), anchSet = new WeakMap(), scanning = false;
  var SENT_SPLIT = /(?<=[.!?…])\s+(?=[¿¡"“«A-ZÁÉÍÓÚÑÜ0-9])|(?<=\p{Ll}[.!?])(?=[¿¡A-ZÁÉÍÓÚÑ])/u;
  function titleish(el) {
    for (var e = el, k = 0; e && e !== document.body && k < 3; e = e.parentElement, k++) {
      var c = typeof e.className === 'string' ? e.className : '';
      if (c && c.split(/[\s_-]+/).some(function (t) { return TITLE_CLS[t.toLowerCase()]; })) return true;
    }
    return false;
  }
  function wordsOf(t) { return t.split(/\s+/).filter(function (w) { return /\p{L}/u.test(w); }); }
  /* 스페인어 문장인지 (영어 안내문 제외) */
  var ES_W = {}, EN_W = {};
  ('de la que el en y los se del las un por con no una su para es al lo como más pero sus le ha me si sin sobre este ya entre cuando todo esta ser son también fue había era muy hasta desde está mi porque qué sólo solo han yo hay vez puede todos así nos ni tiene él uno donde bien ese ahora cada otro después te otros esa eso hace otra tan siempre día ella sí tengo soy estoy eres estás vamos hola gracias usted ustedes nosotros nosotras vosotros vosotras ellos ellas mis tus tu muy dónde cómo cuándo quién cuál cuánto cuánta ' +
   'unos unas este estos estas aquel aquella aquí allí ahí hoy ayer mañana noche tarde semana mes año años días mucho mucha muchos muchas poco poca pocos más menos nada algo alguien nadie nunca también tampoco todavía aún mientras tanto luego entonces pues aunque sino según hacia contra durante tras ' +
   'quiero quieres quiere queremos puedo puedes podemos voy vas va van vamos tienes tenemos tienen soy eres somos sois son estoy estás estamos están hago haces hacemos hacen digo dice dicen veo ves ve vemos sé sabe saben fui fue fueron era eran he has hemos habla hablo hablas hablamos como comes come vivo vives vive llamo llama llamas gusta gustan encanta ' +
   'bueno buena buenos buenas malo mala grande pequeño pequeña nuevo nueva casa calle ciudad país agua comida trabajo escuela clase amigo amiga amigos familia padre madre hijo hija hermano hermana señor señora tiempo hora horas vida mundo gente cosa lugar parte forma manera ' +
   'favor perdón adiós hasta pronto luego claro vale gusto mucho encantado encantada bienvenido bienvenida sol calor frío viento lluvia nieve').split(' ').forEach(function (w) { ES_W[w] = 1; });
  'the and of to is are was were this that these those your you we they it its in on at for with from by an be been have has had do does did will would can could should not or but if then than which what who how when where why there here my our their his her him them me about into just only also more most some any all each every click choose select start begin unit lesson page site study records saved browser voice settings sign login help read listen speak answer check next back word words spell write ask talk say greet goodbye numbers number name names practice review quiz test exercise exercises vocabulary grammar'.split(' ').forEach(function (w) { EN_W[w] = 1; });
  function langOk(t) {
    if (LANG !== 'es') return true;
    var ws = normalize(t).split(' ').filter(Boolean), raw = t.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
    var es = raw.filter(function (w) { return ES_W[w]; }).length + (/[ñ¿¡áéíóúü]/i.test(t) ? 1 : 0);
    var en = raw.filter(function (w) { return EN_W[w] && !ES_W[w]; }).length;
    if (en && en >= es) return false;
    if (en >= 2 && en * 2 >= raw.length) return false;
    return es > 0;
  }
  function blanky(block) {
    var tc = block.textContent || '';
    if (/_{2,}|…\s*…|\(\s*\)|\[\s*\]|[✗✘❌]/.test(tc)) return true;                            /* 빈칸 · 틀린 예문 표시 */
    if (/\p{L}\s+[,.;:!?](\s|$)/u.test(tc.replace(/\s*\n\s*/g, ' ').replace(/\s+([.!?…])\s*$/, '$1'))) return true; /* "no es , es de" 처럼 빈칸이 빠진 문장 */
    for (var e = block, k = 0; e && e !== document.body && k < 2; e = e.parentElement, k++) { var cl = typeof e.className === 'string' ? e.className : ''; if (/(^|[\s_-])(wrong|bad|incorrect|error|err|ng|no-ok|x)([\s_-]|$)/i.test(cl)) return true; }
    var tw = document.createTreeWalker(block, NodeFilter.SHOW_TEXT), tn;
    while ((tn = tw.nextNode())) { if (/\S {2,}\S/.test(tn.nodeValue) && !/\n/.test(tn.nodeValue)) return true; }
    var em = block.querySelectorAll('span,b,u,em,strong,mark,i,div,ins');
    for (var i = 0; i < em.length && i < 400; i++) {
      var x = em[i]; if (x.children.length || (x.textContent || '').trim()) continue;               /* 비어 있거나 공백뿐인 칸 */
      var c = typeof x.className === 'string' ? x.className : '';
      if (/blank|gap|hueco|fill|slot|drop|line|hole/i.test(c) || x.offsetWidth > 14) return true;
    }
    return false;
  }
  function isSentence(t) { return /[.!?…]["”»’)]?$/.test(t) || /^[¿¡]/.test(t); }
  function chipOk(run, block) {
    if (run.length > 260) return false;
    var ws = wordsOf(run); if (ws.length < 2) return false;
    if (!langOk(run)) return false;
    if (/\s(vs\.?|o\/)\s|[\/↔⇄⇔≠≈=+①-⑳]|(^|\s)-\p{L}|\p{L}-\p{Lu}{2}|\p{L}-\p{L}+-\p{L}/u.test(run)) return false;                       /* ser vs estar, -ar/-er */
    var parts = run.split(/\s*[,;]\s*/); if (parts.length >= 3 && parts.every(function (x) { return wordsOf(x).length <= 2; })) return false; /* me, te, se, nos */
    var sent = isSentence(run);
    if (/^H[1-6]$/.test(block.tagName) && !sent) return false;
    if (!sent) {
      var caps = ws.slice(1).filter(function (w) { return /^\p{Lu}/u.test(w); }).length;
      if (ws.length <= 4 && caps >= Math.max(1, Math.ceil((ws.length - 1) * 0.5))) return false; /* Instituto Cervantes, Gramática del Uso */
      if (titleish(block)) return false;
    } else if (titleish(block) && ws.length < 3) return false;
    return true;
  }
  function hasOwnMic(block) {
    for (var e = block, k = 0; e && e !== document.body && k < 2; e = e.parentElement, k++) {
      var bs = e.querySelectorAll('button,[role=button]');
      for (var i = 0; i < bs.length && i < 40; i++) { if (/🎙|🎤/.test(bs[i].textContent || '') && !bs[i].closest('dspk-mic')) return true; }
      if (e.querySelector('.cl-mic,[data-rec]')) return true;
    }
    return false;
  }
  function anchoredNear(el, k0) { var n = normalize(k0); for (var e = el, k = 0; e && e !== document.body && k < 4; e = e.parentElement, k++) { var st = anchSet.get(e); if (st && st[n]) return true; } return false; }
  function markAnch(el, t) { var n = normalize(t); for (var e = el, k = 0; e && e !== document.body && k < 3; e = e.parentElement, k++) { var st = anchSet.get(e); if (!st) anchSet.set(e, st = {}); st[n] = 1; } }
  function newChip(t) { var c = document.createElement('dspk-mic'); c.__dspkText = t; c.setAttribute('data-text', t); return c; }
  var SAY_RE = /(?:^|[^\w$])(?:say|speak|tts|speakText|sayText|playTTS|hablar|leer|pronounce|Voice\.say|EFE\.say)\s*\(\s*(['"`])((?:\\.|(?!\1)[^\\])+)\1/;
  function anchorText(el) {
    var t = el.getAttribute('data-say') || el.getAttribute('data-speak') || el.getAttribute('data-tts') || '';
    if (!t) { var oc = el.getAttribute('onclick') || ''; var m = oc.match(SAY_RE); if (m) t = m[2].replace(/\\(.)/g, '$1'); }
    t = String(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t || t.length > 300) return '';
    var runs = extract(t); if (!runs.length) return '';
    var nr = normalize(runs.join(' ')), nt = normalize(t);
    if (nr.length < nt.length * 0.6) return '';                                        /* 대부분 목표 언어일 때만 */
    if (LANG === 'es' && wordsOf(t).length >= 2 && !langOk(t) && !/[ñ¿¡áéíóúü]/i.test(t)) { var rw = t.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean); if (rw.some(function (w) { return EN_W[w] && !ES_W[w]; })) return ''; }
    if (!wordsOf(t).some(function (w) { return w.replace(/[^\p{L}]/gu, '').length >= 3; })) return '';
    return runs.length === 1 ? runs[0] : t;
  }
  function isControl(el) { return /^(BUTTON|A|INPUT|SUMMARY)$/.test(el.tagName) || el.getAttribute('role') === 'button' || (el.textContent || '').replace(/\s/g, '').length <= 3; }
  function quizzy(el) { for (var e = el, k = 0; e && e !== document.body && k < 3; e = e.parentElement, k++) { var c = typeof e.className === 'string' ? e.className : ''; if (QUIZ_CLS.test(c)) return true; } return false; }
  function scanAnchors(state) {
    var list = document.querySelectorAll('[data-say],[data-speak],[data-tts],[onclick*="say("],[onclick*="speak("],[onclick*="Say("],[onclick*="Speak("],[onclick*="tts("]');
    for (var i = 0; i < list.length && state.total < MAX_CHIPS; i++) {
      var el = list[i];
      if (el.closest('#dspk-host,dspk-mic,nav,header,footer')) continue;
      var t = anchorText(el); if (!t) continue;
      if (el.__dspkA && el.__dspkA.t === t && el.__dspkA.c.isConnected) continue;
      if (!visible(el)) continue;
      if (el.__dspkA && el.__dspkA.c.isConnected) el.__dspkA.c.remove();
      var c = newChip(t);
      if (isControl(el)) {
        if (el.parentElement && el.parentElement.closest('button,a,label,select')) continue;
        var nx = el.nextSibling; while (nx && nx.nodeType === 1 && nx.tagName === 'DSPK-MIC' && nx !== c) { var rm = nx; nx = nx.nextSibling; rm.remove(); }
        el.parentNode.insertBefore(c, el.nextSibling);
      } else {
        if (/^(SELECT|OPTION|TEXTAREA|LABEL)$/.test(el.tagName) || el.querySelector('input,select,textarea') || quizzy(el) || el.closest('button,a,label')) continue;
        el.setAttribute('data-dspk-a', '');
        el.appendChild(c);
      }
      el.__dspkA = { t: t, c: c }; markAnch(c.parentElement, t); state.total++;
    }
  }
  function scanChips() {
    if (!INL || !document.body || scanning) return;
    scanning = true;
    try {
      var state = { total: document.querySelectorAll('dspk-mic').length };
      scanAnchors(state);
      var disp = new Map(), blockedEl = new Map();
      var isInline = function (e) { var d = disp.get(e); if (d == null) { d = getComputedStyle(e).display; disp.set(e, d); } return d === 'inline' || d === 'contents' || (d === 'inline-block' && e.tagName !== 'DIV' && e.tagName !== 'LI'); };
      var blockedFn = function (e) { if (!e) return false; var v = blockedEl.get(e); if (v == null) { v = !!(skipEl(e) || e.closest(NOCHIP)); blockedEl.set(e, v); } return v; };
      var groups = new Map(), order = [];
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (n) {
          if (n.nodeType === 1) { if (SKIP[n.tagName] || n === HOST || n.tagName === 'DSPK-MIC') return NodeFilter.FILTER_REJECT; return n.tagName === 'BR' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }
          return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      });
      var n;
      while ((n = w.nextNode())) {
        if (n.nodeType === 1) { var bb = n; while (bb && bb !== document.body && isInline(bb)) bb = bb.parentElement; var gb = groups.get(bb); if (gb) gb.brk = true; continue; }
        var p = n.parentElement; if (!p || blockedFn(p)) continue;
        var b = p; while (b && b !== document.body && isInline(b)) b = b.parentElement;
        if (!b || b === document.body) continue;
        var g = groups.get(b); if (!g) { g = { nodes: [], seps: [], brk: false }; groups.set(b, g); order.push(b); }
        g.seps.push(g.brk ? '\n' : ''); g.brk = false; g.nodes.push(n);
      }
      order.forEach(function (block) {
        if (state.total >= MAX_CHIPS) return;
        var g = groups.get(block), combined = '', offs = [];
        g.nodes.forEach(function (t, i) { combined += g.seps[i]; offs.push(combined.length); combined += t.nodeValue.replace(/ /g, ' '); });
        combined = combined.replace(/([:;]) (?=\p{Ll})/gu, '$1\u200b')                 /* 문장 안의 ': ' 는 자르지 않기 (길이 그대로) */
          .replace(/([.!?…]["”»’)]?)\s(?=[¿¡"“«\p{Lu}])/gu, '$1\n');                    /* 문장마다 미리 나누기 (길이 그대로) */
        var sig = hash(combined.replace(/\s+/g, ''));
        if (chipSig.get(block) === sig) return;
        if (!visible(block)) return;
        if (hasOwnMic(block) || block.querySelector('input:not([type=hidden]),select,textarea') || quizzy(block) || blanky(block)) { chipSig.set(block, sig); return; }
        var runs = [];
        extract(combined).forEach(function (r) { r.split(SENT_SPLIT).forEach(function (y) { y.split(/\s*[—–]\s*/).forEach(function (x) { x = cleanPiece(x.trim()); if (x && chipOk(x, block) && !anchoredNear(block, x)) runs.push(x); }); }); });
        var have = {};
        Array.prototype.forEach.call(block.querySelectorAll('dspk-mic'), function (c) {
          if (c.parentElement && c.parentElement.hasAttribute('data-dspk-a')) return;
          var cb = c.parentElement; while (cb && cb !== document.body && isInline(cb)) cb = cb.parentElement;
          if (cb !== block) return;
          var t = chipText(c).replace(/([:;]) (?=\p{Ll})/gu, '$1\u200b'); if (runs.indexOf(t) < 0 && c !== (A && A.inline) && c !== POP.chip) { var prev = c.previousElementSibling; if (!(prev && prev.__dspkA && prev.__dspkA.c === c)) c.remove(); } else have[t] = 1;
        });
        var from = 0;
        runs.forEach(function (run) {
          if (have[run] || state.total >= MAX_CHIPS) return;
          var idx = combined.indexOf(run, from); if (idx < 0) idx = combined.indexOf(run); if (idx < 0) return;
          var end = idx + run.length; from = end;
          for (var i = g.nodes.length - 1; i >= 0; i--) {
            if (offs[i] < end) {
              var node = g.nodes[i]; if (!node.parentNode || !node.parentElement || !visible(node.parentElement)) return;
              var cut = end - offs[i];
              var m = node.nodeValue.slice(cut).match(/^[.!?…"”»'’)\]]+/); if (m) cut += m[0].length;
              if (cut < node.nodeValue.length) { var after = node.splitText(cut); g.nodes.splice(i + 1, 0, after); offs.splice(i + 1, 0, offs[i] + cut); }
              node.parentNode.insertBefore(newChip(run.replace(/\u200b/g, ' ')), node.nextSibling); state.total++;
              break;
            }
          }
        });
        chipSig.set(block, sig);
      });
    } catch (e) { try { console.warn('[speak] chips', e); } catch (x) {} }
    scanning = false;
    if (chipMO) chipMO.takeRecords();
  }
  var chipMO = null, chipT = null;
  function chipsSoon(ms) { clearTimeout(chipT); chipT = setTimeout(function () { (window.requestIdleCallback || setTimeout)(scanChips, { timeout: 800 }); }, ms || 500); }
  function startChips() {
    if (!INL) return;
    scanChips();
    try {
      chipMO = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          var t = recs[i].target; if (t === HOST || (t.closest && t.closest('#dspk-host'))) continue;
          if (recs[i].type === 'childList') { var only = true; recs[i].addedNodes.forEach(function (x) { if (!(x.nodeType === 1 && x.tagName === 'DSPK-MIC') && !(x.nodeType === 3)) only = false; }); if (only && !recs[i].removedNodes.length && recs[i].addedNodes.length && recs[i].addedNodes[0].nodeType === 1) continue; }
          chipsSoon(); return;
        }
      });
      chipMO.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-hidden'] });
    } catch (e) {}
    window.addEventListener('hashchange', function () { chipsSoon(400); });
    document.addEventListener('click', function () { chipsSoon(700); }, true);
  }

  /* 칩 누르기 → 녹음 시작 · 결과 카드 */
  var POP = { chip: null, st: '', prog: null };
  function chipClick(chip) {
    if (A && A.inline === chip) { stopAttempt(); return; }
    if (ST.busy) { if (A) cancelAttempt(); else return; }
    var t = chipText(chip); if (!t) return;
    if (POP.chip && POP.chip !== chip) chipState(POP.chip, '');
    setCur(t); POP.chip = chip; POP.prog = null;
    chipState(chip, 'rec');
    startAttempt(chip);
  }
  function popEl() { return R.querySelector('.ip'); }
  function closePop() {
    var p = popEl(); if (p) p.classList.remove('on');
    if (POP.chip) chipState(POP.chip, POP.chip === (A && A.inline) ? 'rec' : '');
    POP.chip = null; POP.st = '';
  }
  function placePop() {
    var p = popEl(); if (!p || !POP.chip || !p.classList.contains('on')) return;
    var r = POP.chip.getBoundingClientRect(), W = Math.min(380, window.innerWidth - 16), H = p.offsetHeight || 220;
    var left = clamp(r.left + r.width / 2 - W / 2, 8, window.innerWidth - W - 8), top = r.bottom + 8;
    if (top + H > window.innerHeight - 8 && r.top - H - 8 > 8) top = r.top - H - 8;
    p.style.width = W + 'px'; p.style.left = left + 'px'; p.style.top = clamp(top, 8, Math.max(8, window.innerHeight - H - 8)) + 'px';
  }
  window.addEventListener('scroll', function () { if (POP.chip) requestAnimationFrame(placePop); }, true);
  window.addEventListener('resize', function () { if (POP.chip) requestAnimationFrame(placePop); });
  function popHead(marks) {
    var t = POP.chip ? chipText(POP.chip) : ST.cur || '';
    var body = marks ? marks.map(function (m) { return m.p ? esc(m.t) : '<span class="w ' + (m.ok ? 'ok' : 'no') + '">' + esc(m.t) + '</span>'; }).join('') : esc(t);
    return '<div class="ip-h"><div class="ip-t" lang="' + LG.tts[0] + '"' + (LANG === 'ar' ? ' dir="rtl"' : '') + '>' + body + '</div><button class="ip-x" data-act="ipClose" aria-label="close">✕</button></div>';
  }
  function popState(st) {
    if (!POP.chip || !(A ? A.inline === POP.chip : true)) return;
    var p = popEl(); if (!p) return;
    POP.st = st;
    if (st === 'listen') {
      p.innerHTML = popHead() + '<div class="ip-b"><div class="ip-st"><span class="ip-dot"></span><b>' + esc(tx('듣고 있어요… 지금 말하세요!', 'Listening… speak now!')) + '</b></div>' +
        '<div class="ip-m"><i></i></div><div class="ip-live" lang="' + LG.tts[0] + '"></div>' +
        '<div class="row mt"><button class="btn s a" data-act="ipStop">⏹ ' + esc(tx('멈추기', 'Stop')) + '</button><button class="btn s" data-act="ipSay">🔊 ' + esc(tx('원어민', 'Native')) + '</button><span class="muted">' + esc(tx('다 말하면 자동으로 멈춰요', 'Stops automatically')) + '</span></div></div>';
    } else if (st === 'scoring') {
      var b0 = p.querySelector('.ip-b'); if (b0) b0.innerHTML = '<div class="ip-st"><span class="ip-spin"></span><b>' + esc(tx('평가하는 중…', 'Scoring…')) + '</b></div>';
    } else if (st === 'ai') {
      chipState(POP.chip, 'busy');
      var b1 = p.querySelector('.ip-b'); if (b1) b1.innerHTML = '<div class="ip-st"><span class="ip-spin"></span><b>🧠 ' + esc(tx('AI가 녹음을 분석하는 중…', 'AI is analyzing…')) + '</b></div><div class="ip-m pg"><i style="width:6%"></i></div><div class="muted ip-pt">' + esc(tx('잠시만 기다려 주세요.', 'One moment…')) + '</div>';
    }
    p.classList.add('on'); placePop();
  }
  function popProg(pr, total) {
    if (!POP.chip) return; var p = popEl(); if (!p) return;
    var bar = p.querySelector('.ip-m.pg i'), t = p.querySelector('.ip-pt');
    if (bar) bar.style.width = Math.max(6, Math.round(pr * 100)) + '%';
    if (t && total) t.textContent = tx('발음 분석기 내려받는 중… ' + Math.round(pr * 100) + '% (처음 한 번만, 약 ' + Math.round(total / 1048576) + 'MB)', 'Downloading analyzer… ' + Math.round(pr * 100) + '% (first time only, ~' + Math.round(total / 1048576) + 'MB)');
  }
  function onLevel(a) { if (!POP.chip || a.inline !== POP.chip) return; var i = R.querySelector('.ip .ip-m:not(.pg) i'); if (i) i.style.width = Math.round(a.level * 100) + '%'; }
  function popLive() { if (!POP.chip || !A || A.inline !== POP.chip) return; var l = R.querySelector('.ip .ip-live'); if (l) l.textContent = ST.live || ''; }
  function popResult() {
    var p = popEl(), r = ST.result; if (!p || !POP.chip || !r) return;
    var h = popHead(r.marks) + '<div class="ip-b">';
    if (r.self) {
      if (r.stars) h += '<div class="res"><div class="ring sm" style="--p:' + r.total + '"><span>' + r.stars + '★</span></div><div><b>' + esc(tx('스스로 평가 완료', 'Self-check saved')) + '</b>' + (r.xp != null ? '<br><span class="xp">+' + r.xp + ' XP</span>' : '') + '</div></div>';
      else h += '<b>' + esc(r.aiFail ? tx('🧠 발음 분석기를 불러오지 못했어요. 녹음을 원어민과 비교해 스스로 평가해 주세요.', 'Could not load the analyzer — compare and rate yourself.') : tx('🎧 내 녹음을 원어민과 비교해 들어 보세요', '🎧 Compare your recording with the native voice')) + '</b>' +
        '<div class="stars">' + [1, 2, 3, 4, 5].map(function (k) { return '<button data-act="star" data-v="' + k + '">' + k + '★</button>'; }).join('') + '</div>' +
        (r.aiFail ? '<div class="muted">' + esc(tx('학교 방화벽이 cdn.jsdelivr.net · huggingface.co 를 막고 있을 수 있어요.', 'A firewall may block cdn.jsdelivr.net / huggingface.co.')) + '</div>' : '');
    } else if (r.empty) {
      h += '<b>🙉 ' + esc(tx('잘 들리지 않았어요', "Couldn't hear you")) + '</b><div class="muted">' + esc(tx('마이크 가까이에서 또박또박 다시 말해 보세요.', 'Speak a little louder, close to the mic.')) + '</div>';
    } else {
      var col = r.total >= 85 ? '#16a34a' : r.total >= 70 ? '#e0a100' : '#e0386b';
      h += '<div class="res"><div class="ring sm" style="--p:' + r.total + ';--c:' + col + '"><span>' + r.total + '</span></div><div><span class="grade">' + gradeOf(r.total) + '</span><b>' + esc(praise(r.total)) + '</b>' +
        (r.xp != null ? ' <span class="xp">+' + r.xp + ' XP</span>' : '') + (r.note ? '<div class="note">' + esc(r.note) + '</div>' : '') + '</div></div>' +
        '<div class="bars">' + [[tx('정확도', 'Accuracy'), r.acc], [tx('완성도', 'Complete'), r.comp], [tx('유창성', 'Fluency'), r.flu]].filter(function (b) { return b[1] != null; }).map(function (b) {
          return '<div class="bar"><span>' + esc(b[0]) + '</span><span class="t"><i style="width:' + b[1] + '%"></i></span><span>' + b[1] + '</span></div>'; }).join('') + '</div>' +
        '<div class="heard">🗣 ' + esc(tx('들린 말: ', 'Heard: ')) + '<b lang="' + LG.tts[0] + '">' + esc(r.heard || '—') + '</b>' + (r.via === 'ai' ? ' <small>· 🧠 ' + esc(tx('AI 분석', 'AI')) + '</small>' : '') + '</div>';
    }
    h += '<div class="row mt">' + (r.blob ? '<button class="btn s" data-act="playMine">▶ ' + esc(tx('내 녹음', 'Mine')) + '</button><button class="btn s" data-act="compare">🔁 ' + esc(tx('원어민→나', 'Native→me')) + '</button>' : '') +
      '<button class="btn s" data-act="ipSay">🔊</button>' + (r.blob ? '<button class="btn s" data-act="dl" title="' + esc(tx('녹음 저장', 'Save')) + '">⬇</button>' : '') +
      '<button class="btn s a" data-act="ipAgain">🎙 ' + esc(tx('다시', 'Again')) + '</button><button class="btn s g" data-act="ipMore" title="' + esc(tx('내 기록·반·리그', 'Stats')) + '">📊</button></div></div>';
    p.innerHTML = h; p.classList.add('on'); POP.st = 'result'; placePop();
  }
  document.addEventListener('pointerdown', function (e) {
    if (!POP.chip || ST.busy) return;
    var path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(HOST) >= 0 || path.indexOf(POP.chip) >= 0) return;
    closePop();
  }, true);

  /* ---------------- 시작 ---------------- */
  function boot() {
    mount();
    if (INL) setTimeout(startChips, 600);
    var cls = new URLSearchParams(location.search).get('speakClass');
    if (cls) {
      ST.tab = 'class'; openPanel(true);
      fb().then(function () {
        var tries = 0; (function wait() {
          if (ST.user) joinClass(cls); else if (++tries < 40) setTimeout(wait, 300);
          else { ST.msg = tx('로그인하면 반 ' + cls + '에 자동으로 들어가요', 'Sign in to join class ' + cls); render(); var w2 = setInterval(function () { if (ST.user) { clearInterval(w2); joinClass(cls); } }, 1000); }
        })();
      });
    } else {
      setTimeout(function () { fb(); }, 2500);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.addEventListener('hashchange', function () { ST.items = []; if (ST.open) setTimeout(function () { ST.items = scanPage(); if (ST.tab === 'practice' && !ST.busy) render(); }, 700); });
  window.DainSpeak = { open: function () { openPanel(true); }, practice: function (t) { setCur(t); openPanel(true); render(); }, lang: LANG, site: SITE, inline: INL, rescan: function () { if (INL) scanChips(); }, _extract: extract, _score: score, _normalize: normalize, _scan: scanPage };
})();
