/*!
 * Site Main Control — guard.js
 * 다인에듀(yalli2) GitHub Pages 사이트 접속 관리 스크립트
 *
 * 사용법: 각 사이트 HTML의 <head> 바로 아래에 한 줄 추가
 *   <script src="https://yalli2.github.io/site_main_control/guard.js" data-site="저장소이름"></script>
 *
 * - 관리 콘솔에서 사이트 모드를 '공개'로 두면 아무 영향 없이 그대로 열립니다.
 * - config.js에 Firebase 설정이 없으면(설치 전) 항상 그대로 열립니다(안전).
 */
(function () {
  'use strict';
  if (window.__SMC_GUARD__) return;
  window.__SMC_GUARD__ = true;

  var FBV = '10.12.2';
  var me = document.currentScript;
  var BASE = (me && me.src) ? me.src.replace(/guard\.js.*$/, '') : 'https://yalli2.github.io/site_main_control/';
  var rawSite = (me && me.getAttribute('data-site')) || decodeURIComponent(location.pathname.split('/')[1] || 'root');
  var SITE = String(rawSite).toLowerCase();
  var LANG = /^ko/i.test(navigator.language || 'ko') ? 'ko' : 'en';
  var ROOT = document.documentElement;
  var CACHE_KEY = 'smc:site:' + SITE;

  /* ---------------- 다인에듀 공통 테마 (request_for_quotation/theme) ----------------
     사이트별 덧입히기 파일을 자동으로 연결합니다. 테마를 빼려면 아래 DT_MAP에서 그 사이트를 지우세요. */
  (function () {
    var T = 'https://yalli2.github.io/request_for_quotation/theme/';
    var DT_MAP = {"1500_a1":"sites/1500_A1","1500_a2":"sites/1500_A2","1500_b1":"sites/1500_B1","1500_b2":"sites/1500_B2","1500_c1":"sites/1500_C1","1500_c2":"sites/1500_C2","7emotions":"kits/hr","brain_cross_training":"sites/Brain_Cross_Training","dk_efe_cb_l2":"sites/DK_EfE_CB_L2","dainedu_cost":"sites/Dainedu_Cost","gdu":"sites/GdU","gdu_a1_b2":"sites/GdU_A1_B2","gdu_b1_b2":"sites/GdU_B1_B2","gdu_c1_c2":"sites/GdU_C1_C2","jap_con":"sites/Jap_Con","jap_gra_n5":"sites/Jap_Gra_N5","oral-test":"sites/Oral-test","por_gra":"sites/Por_Gra","speaking-test":"sites/Speaking-Test","activas1":"sites/activas1","adobe_apps":"sites/adobe_apps","ai_engines":"kits/practice","ai_stock":"sites/ai_stock","arabic_grammar":"sites/arabic_grammar","aula1":"kits/aula","aula2":"kits/aula","aula3":"kits/aula","aula4":"kits/aula","aula5":"kits/aula","auto_marketing":"sites/auto_marketing","basic_arabic":"sites/basic_arabic","basic_grammar_12w":"kits/course","business":"sites/business","catalan_grammar":"sites/catalan_grammar","ceo_dainedu":"sites/ceo_dainedu","chinese_grammar":"sites/chinese_grammar","confusing_spanish":"sites/confusing_spanish","construction_spanish_1":"kits/obra","construction_spanish_2":"kits/obra","construction_spanish_3":"kits/obra","dainedu_budget":"sites/dainedu_budget","dainedu_curriculum":"sites/dainedu_curriculum","dainedu_dele_b1":"kits/course","dainedu_dele_b2":"kits/course","dainedu_fee":"sites/dainedu_fee","dainedu_intro":"sites/dainedu_intro","dainedu_lms":"sites/dainedu_lms","dainedu_spanish_basic_grammar":"sites/dainedu_spanish_basic_grammar","dalton_spanish_essay":"sites/dalton_spanish_essay","debt_free":"sites/debt_free","dele_a1":"kits/course","dele_a2":"kits/course","dele_b1":"sites/dele_b1","dele_b2":"sites/dele_b2","dele_c1":"sites/dele_c1","dele_c2":"sites/dele_c2","delf_a1":"sites/delf_a1","delf_a2j":"sites/delf_a2j","delf_b2":"sites/delf_b2","delf_b2j":"sites/delf_b2j","dongguk_univ":"sites/dongguk_univ","eat_the_frog":"sites/eat_the_frog","eco_a1":"sites/eco_a1","eng_verb_500":"sites/eng_verb_500","enneagram":"sites/enneagram","etf_usa":"sites/etf_usa","event4students":"sites/event4students","fayston_1114":"sites/fayston_1114","fayston_20261121":"sites/fayston_20261121","flex_dainedu":"kits/course","flex_spanish":"sites/flex_spanish","french_conversation":"sites/french_conversation","gamma_practice":"sites/gamma_practice","gdu_avanzado":"kits/course","gdu_basico":"kits/course","gdu_intermedio":"kits/course","github_practice":"sites/github_practice","gpe":"sites/gpe","growth_playbook":"sites/growth_playbook","heyzen_practice":"sites/heyzen_practice","hoyeon_spanish_unidad2":"sites/hoyeon_spanish_unidad2","hoyeon_tarea":"sites/hoyeon_tarea","hsk_1_cb":"sites/hsk_1_cb","hsk_2_cb":"sites/hsk_2_cb","hsk_3_cb":"sites/hsk_3_cb","hsk_4a_cb":"sites/hsk_4a_cb","hsk_4b_cb":"sites/hsk_4b_cb","hsk_5a_cb":"sites/hsk_5a_cb","hsk_5b_cb":"sites/hsk_5b_cb","hsk_6a_cb":"sites/hsk_6a_cb","hsk_6b_cb":"sites/hsk_6b_cb","ibs_final":"sites/ibs_final","inventos_100":"sites/inventos_100","italian_grammar":"sites/italian_grammar","japan_travel":"sites/japan_travel","jiyu_spanish":"sites/jiyu_spanish","jiyu_test_1113":"sites/jiyu_test_1113","jiyu_test_1113-2":"sites/jiyu_test_1113-2","kastic":"sites/kastic","ksef":"sites/ksef","latin_grammar":"sites/latin_grammar","latin_verb":"sites/latin_verb","lecture_timeline":"sites/lecture_timeline","major_spanish":"sites/major_spanish","major_spanish_v2":"sites/major_spanish_v2","maono_ame2":"sites/maono_ame2","mbti":"sites/mbti","mdh_ai_basic":"sites/mdh_ai_basic","metodo_a1":"sites/metodo_a1","money_math":"sites/money_math","my_site":"sites/my_site","note_taking":"sites/note_taking","osaka":"sites/osaka","osaka_juyupass":"sites/osaka_juyupass","osaka_us":"sites/osaka_us","pinterest_search":"sites/pinterest_search","powerful_focus":"sites/powerful_focus","psychic-journey":"sites/psychic-journey","psychology":"sites/psychology","public_speaking":"sites/public_speaking","russian_grammar":"sites/russian_grammar","sample_class":"sites/sample_class","scribd_lang_list":"sites/scribd_lang_list","scribd_language":"sites/scribd_language","scribd_magazine":"sites/scribd_magazine","scribd_selfdev":"sites/scribd_selfdev","self_improvement":"sites/self_improvement","selfstudy":"sites/selfstudy","site_main_control":"sites/site_main_control","slack_ai":"sites/slack_ai","snult_dainedu":"kits/course","snult_spanish":"sites/snult_spanish","spa_con":"sites/spa_con","spa_con_9":"sites/spa_con_9","spa_level_test":"sites/spa_level_test","spa_verb_conjugator":"sites/spa_verb_conjugator","spanish-chapter5":"sites/spanish-chapter5","spanish_conversation":"sites/spanish_conversation","spanish_verb":"sites/spanish_verb","study_skill":"sites/study_skill","takamatsu":"sites/takamatsu","tarot":"sites/tarot","tarot_card":"sites/tarot_card","toeic_speaking":"sites/toeic_speaking","travel_spanish":"sites/travel_spanish","travel_spanish_8w":"kits/course","tuescuela":"sites/tuescuela","tuescueladeespanol":"sites/tuescueladeespanol","university":"sites/university","useful_notes":"sites/useful_notes","world_english":"sites/world_english","worldlanguage":"sites/worldlanguage","zapier_practice":"sites/zapier_practice"};
    var key = DT_MAP[SITE] || DT_MAP[String(location.pathname.split('/')[1] || '').toLowerCase()];
    if (!key) return;
    var st = document.createElement('style');
    st.textContent = 'html.dt-wait body{opacity:0!important}';
    (document.head || ROOT).appendChild(st);
    ROOT.classList.add('dt-wait');
    var done = function () { ROOT.classList.remove('dt-wait'); };
    setTimeout(done, 1500);
    var add = function () {
      if (document.querySelector('link[href*="/request_for_quotation/theme/dain-theme.css"]')) { done(); return; }
      var host = document.body || document.head || ROOT, left = 2;
      [T + 'dain-theme.css', T + key + '.css'].forEach(function (u) {
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = u; l.setAttribute('data-dain-theme', '');
        l.onload = l.onerror = function () { if (--left <= 0) done(); };
        host.appendChild(l);
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  })();

  /* ---------------- 문구 ---------------- */
  var TXT = {
    ko: {
      checking: '접속 권한을 확인하고 있어요…',
      membersOnly: '회원 전용 사이트입니다',
      loginDesc: '등록된 계정으로 로그인하면 바로 이용할 수 있어요.',
      google: 'Google 계정으로 로그인',
      or: '또는 이메일로',
      email: '이메일', password: '비밀번호', name: '이름',
      login: '로그인', signup: '회원가입', loginTab: '로그인', signupTab: '처음이에요(가입)',
      forgot: '비밀번호를 잊으셨나요?', resetSent: '비밀번호 재설정 메일을 보냈어요. 메일함을 확인하세요.',
      verifyTitle: '이메일 인증이 필요해요',
      verifyDesc: '가입한 이메일로 인증 메일을 보냈어요. 메일의 링크를 누른 뒤 아래 버튼을 눌러 주세요.',
      verifyDone: '인증 완료했어요', resend: '인증 메일 다시 보내기', resent: '인증 메일을 다시 보냈어요.',
      deniedTitle: '접근 권한이 없어요',
      notmember: '아직 등록되지 않은 계정입니다. 선생님(관리자)에게 접근을 요청하세요.',
      suspended: '이 계정은 현재 이용이 정지되어 있어요. 관리자에게 문의하세요.',
      expired: '이용 기간이 끝났어요. 연장이 필요하면 관리자에게 요청하세요.',
      nosite: '이 계정에는 이 사이트 권한이 없어요. 아래 버튼으로 접근을 요청할 수 있어요.',
      request: '접근 요청 보내기', requestMsg: '요청 메시지 (선택) — 예: KCIS 스페인어 1반 김민수',
      requested: '요청을 보냈어요! 관리자가 승인하면 새로고침해서 이용하세요.',
      alreadyRequested: '이미 요청을 보냈어요. 승인을 기다려 주세요.',
      switchAccount: '다른 계정으로 로그인', logout: '로그아웃', console: '관리 콘솔',
      maintTitle: '점검 중입니다', maintDesc: '더 좋은 내용으로 준비하고 있어요. 잠시 후 다시 접속해 주세요.',
      closedTitle: '지금은 접속할 수 없어요', closedDesc: '이 사이트는 현재 비공개 상태입니다.',
      notYet: '공개 예정일: ', ended: '공개 기간이 끝났어요: ',
      adminLogin: '관리자 로그인', retry: '다시 시도',
      errTitle: '연결에 문제가 있어요', errDesc: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.',
      kakao: '카카오톡 안에서는 Google 로그인이 막혀 있어요. 외부 브라우저로 열어 주세요.',
      openExternal: '외부 브라우저로 열기',
      signedInAs: '로그인 계정', poweredBy: '다인에듀 사이트 접속 관리',
      e_invalid: '이메일 또는 비밀번호가 올바르지 않아요.', e_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
      e_weak: '비밀번호는 6자 이상으로 정해 주세요.', e_email: '이메일 형식을 확인해 주세요.',
      e_popup: '로그인 창이 닫혔어요. 다시 시도해 주세요.', e_domain: '관리자 설정이 필요해요 (승인된 도메인 미등록).',
      e_many: '시도가 너무 많아요. 잠시 후 다시 해 주세요.', e_net: '네트워크 오류가 발생했어요.'
    },
    en: {
      checking: 'Checking your access…',
      membersOnly: 'Members-only site',
      loginDesc: 'Sign in with your registered account to continue.',
      google: 'Continue with Google',
      or: 'or with email',
      email: 'Email', password: 'Password', name: 'Name',
      login: 'Sign in', signup: 'Create account', loginTab: 'Sign in', signupTab: 'New here? Sign up',
      forgot: 'Forgot password?', resetSent: 'Password reset email sent. Check your inbox.',
      verifyTitle: 'Please verify your email',
      verifyDesc: 'We sent a verification link to your email. Click it, then press the button below.',
      verifyDone: 'I have verified', resend: 'Resend email', resent: 'Verification email sent again.',
      deniedTitle: 'Access denied',
      notmember: 'This account is not registered yet. Ask the administrator for access.',
      suspended: 'This account is suspended. Please contact the administrator.',
      expired: 'Your access period has ended. Ask the administrator to extend it.',
      nosite: 'Your account does not have access to this site. You can request access below.',
      request: 'Request access', requestMsg: 'Message (optional) — e.g. class and name',
      requested: 'Request sent! Refresh after the administrator approves it.',
      alreadyRequested: 'You have already sent a request. Please wait for approval.',
      switchAccount: 'Use another account', logout: 'Sign out', console: 'Admin console',
      maintTitle: 'Under maintenance', maintDesc: 'We are improving this site. Please come back soon.',
      closedTitle: 'Not available right now', closedDesc: 'This site is currently private.',
      notYet: 'Opens on: ', ended: 'Closed since: ',
      adminLogin: 'Admin sign-in', retry: 'Try again',
      errTitle: 'Connection problem', errDesc: 'Please check your internet connection and try again.',
      kakao: 'Google sign-in is blocked inside KakaoTalk. Please open in an external browser.',
      openExternal: 'Open in browser',
      signedInAs: 'Signed in as', poweredBy: 'Dain Edu site access control',
      e_invalid: 'Wrong email or password.', e_exists: 'This email is already registered. Please sign in.',
      e_weak: 'Password must be at least 6 characters.', e_email: 'Please check the email format.',
      e_popup: 'The sign-in window was closed. Please try again.', e_domain: 'Admin setup required (unauthorized domain).',
      e_many: 'Too many attempts. Please try again later.', e_net: 'Network error.'
    }
  };
  function t(k) { return (TXT[LANG] && TXT[LANG][k]) || TXT.ko[k] || k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { return new Date().toLocaleDateString('sv-SE'); }

  /* ---------------- 화면 잠금 ---------------- */
  var CSS = [
    'html.smc-lock,html.smc-lock body{overflow:hidden!important}',
    'html.smc-lock body{visibility:hidden!important}',
    '#smc-ov{position:fixed;inset:0;z-index:2147483646;visibility:visible!important;display:flex;align-items:center;justify-content:center;padding:20px;',
    'background:radial-gradient(1200px 600px at 10% -10%,#c7d2fe 0,transparent 60%),radial-gradient(900px 500px at 110% 110%,#fbcfe8 0,transparent 55%),#f8fafc;',
    'font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;color:#0f172a;overflow:auto}',
    '#smc-ov *{box-sizing:border-box;font-family:inherit}',
    '#smc-ov .smc-card{width:100%;max-width:420px;background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(15,23,42,.15);padding:30px 28px;text-align:center;animation:smcIn .35s ease}',
    '@keyframes smcIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '#smc-ov .smc-ico{font-size:44px;line-height:1;margin-bottom:10px}',
    '#smc-ov .smc-site{display:inline-block;font-size:12px;font-weight:700;color:#4f46e5;background:#eef2ff;border-radius:999px;padding:4px 10px;margin-bottom:10px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '#smc-ov h2{font-size:21px;margin:0 0 8px;font-weight:800;letter-spacing:-.02em}',
    '#smc-ov p{font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px}',
    '#smc-ov .smc-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:0;border-radius:12px;padding:12px 14px;font-size:15px;font-weight:700;cursor:pointer;margin-top:8px;text-decoration:none;transition:transform .05s,filter .15s}',
    '#smc-ov .smc-btn:active{transform:scale(.98)}',
    '#smc-ov .smc-pri{background:#4f46e5;color:#fff}#smc-ov .smc-pri:hover{filter:brightness(1.08)}',
    '#smc-ov .smc-g{background:#fff;color:#0f172a;border:1.5px solid #e2e8f0}#smc-ov .smc-g:hover{background:#f8fafc}',
    '#smc-ov .smc-ghost{background:transparent;color:#64748b;font-weight:600;font-size:13px;padding:8px}',
    '#smc-ov .smc-kakao{background:#fee500;color:#191600}',
    '#smc-ov input,#smc-ov textarea{width:100%;border:1.5px solid #e2e8f0;border-radius:11px;padding:11px 12px;font-size:15px;margin-top:8px;outline:none;background:#fff;color:#0f172a}',
    '#smc-ov input:focus,#smc-ov textarea:focus{border-color:#818cf8;box-shadow:0 0 0 3px #e0e7ff}',
    '#smc-ov .smc-or{display:flex;align-items:center;gap:10px;color:#94a3b8;font-size:12px;margin:16px 0 4px}',
    '#smc-ov .smc-or:before,#smc-ov .smc-or:after{content:"";flex:1;height:1px;background:#e2e8f0}',
    '#smc-ov .smc-tabs{display:flex;background:#f1f5f9;border-radius:11px;padding:3px;margin-top:10px}',
    '#smc-ov .smc-tabs button{flex:1;border:0;background:transparent;padding:8px;border-radius:9px;font-size:13px;font-weight:700;color:#64748b;cursor:pointer}',
    '#smc-ov .smc-tabs button.on{background:#fff;color:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
    '#smc-ov .smc-msg{font-size:13px;border-radius:10px;padding:9px 11px;margin-top:10px;text-align:left}',
    '#smc-ov .smc-err{background:#fef2f2;color:#b91c1c}#smc-ov .smc-ok{background:#f0fdf4;color:#15803d}',
    '#smc-ov .smc-who{font-size:13px;background:#f8fafc;border-radius:10px;padding:8px 10px;color:#334155;margin-bottom:6px;word-break:break-all}',
    '#smc-ov .smc-foot{margin-top:18px;font-size:11px;color:#94a3b8}',
    '#smc-ov .smc-spin{width:34px;height:34px;border:3px solid #e0e7ff;border-top-color:#4f46e5;border-radius:50%;animation:smcSp .8s linear infinite;margin:0 auto 14px}',
    '@keyframes smcSp{to{transform:rotate(360deg)}}',
    '#smc-badge{position:fixed;left:12px;bottom:12px;z-index:2147483645;font:600 12px/1 Pretendard,system-ui,sans-serif;visibility:visible!important}',
    '#smc-badge .b{display:flex;align-items:center;gap:7px;background:rgba(15,23,42,.82);color:#fff;border:0;border-radius:999px;padding:6px 10px 6px 6px;cursor:pointer;backdrop-filter:blur(6px);box-shadow:0 4px 14px rgba(0,0,0,.18);max-width:260px}',
    '#smc-badge .av{width:22px;height:22px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:11px;flex:none}',
    '#smc-badge .em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:max-width .3s;max-width:190px}',
    '#smc-badge.mini .em{max-width:0}#smc-badge.mini .b{padding-right:6px;gap:0}',
    '#smc-badge .m{position:absolute;bottom:38px;left:0;background:#fff;color:#0f172a;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:6px;min-width:170px;display:none}',
    '#smc-badge.open .m{display:block}',
    '#smc-badge .m a,#smc-badge .m button{display:block;width:100%;text-align:left;border:0;background:none;padding:9px 10px;border-radius:8px;font:600 13px Pretendard,system-ui,sans-serif;color:#0f172a;cursor:pointer;text-decoration:none}',
    '#smc-badge .m a:hover,#smc-badge .m button:hover{background:#f1f5f9}',
    '#smc-badge .m .h{font-size:11px;color:#64748b;padding:6px 10px 4px;word-break:break-all}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'smc-style';
  style.textContent = CSS;
  (document.head || ROOT).appendChild(style);

  function lock() { ROOT.classList.add('smc-lock'); }
  function unlock() { ROOT.classList.remove('smc-lock'); removeOverlay(); }
  lock();

  var ov = null;
  function whenBody(fn) { if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function overlay(html) {
    whenBody(function () {
      if (!ov) { ov = document.createElement('div'); ov.id = 'smc-ov'; ov.setAttribute('role', 'dialog'); document.body.appendChild(ov); }
      ov.innerHTML = '<div class="smc-card">' + html + '<div class="smc-foot">🛡️ ' + esc(t('poweredBy')) + '</div></div>';
    });
  }
  function removeOverlay() { if (ov && ov.parentNode) ov.parentNode.removeChild(ov); ov = null; }

  // 0.4초 이상 걸리면 로딩 화면 표시
  var loadingTimer = setTimeout(function () {
    if (ROOT.classList.contains('smc-lock') && !ov) overlay('<div class="smc-spin"></div><p style="margin:0">' + esc(t('checking')) + '</p>');
  }, 400);

  /* ---------------- 캐시(빠른 표시) ---------------- */
  function readCache() {
    try { var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); if (c && Date.now() - c.t < 30 * 60 * 1000) return c; } catch (e) {}
    return null;
  }
  function saveCache(p) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), mode: p.mode, openFrom: p.openFrom || '', openUntil: p.openUntil || '' })); } catch (e) {}
  }
  function effMode(p) {
    var m = p.mode || 'public';
    if (m !== 'closed') {
      var d = today();
      if (p.openFrom && d < p.openFrom) return { mode: 'closed', why: 'notYet', date: p.openFrom };
      if (p.openUntil && d > p.openUntil) return { mode: 'closed', why: 'ended', date: p.openUntil };
    }
    return { mode: m };
  }
  var cached = readCache();
  if (cached && effMode(cached).mode === 'public') unlock(); // 공개 사이트는 즉시 표시

  /* ---------------- 시작 ---------------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = rej;
      (document.head || ROOT).appendChild(s);
    });
  }

  /* 🎙 말하기 연습 모듈(speak.js) — 어학 사이트에만 나타나요. 끄기: 이 스크립트에 data-speak="off" 또는 config options.speak:false */
  function loadSpeak() {
    try {
      var o = (window.SMC_CONFIG && window.SMC_CONFIG.options) || {};
      if (o.speak === false || (me && me.getAttribute('data-speak') === 'off') || window.__DAIN_SPEAK__) return;
      var sp = document.createElement('script');
      sp.src = BASE + 'speak.js?v=' + Math.floor(Date.now() / 600000); sp.async = true;
      sp.setAttribute('data-site', rawSite);
      if (me && me.getAttribute('data-speak-lang')) sp.setAttribute('data-lang', me.getAttribute('data-speak-lang'));
      if (me && me.getAttribute('data-speak-inline')) sp.setAttribute('data-inline', me.getAttribute('data-speak-inline'));
      (document.head || ROOT).appendChild(sp);
    } catch (e) {}
  }

  loadScript(BASE + 'config.js?v=' + Math.floor(Date.now() / 300000)).then(function () { loadSpeak(); start(); }, function () { clearTimeout(loadingTimer); unlock(); });

  function start() {
    var cfg = window.SMC_CONFIG;
    if (!cfg || !cfg.firebase || !cfg.firebase.apiKey) { clearTimeout(loadingTimer); unlock(); return; }
    var opts = cfg.options || {};
    var admins = (cfg.adminEmails || []).map(function (e) { return String(e).toLowerCase(); });

    Promise.all([
      import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-firestore.js')
    ]).then(function (m) { run(m[0], m[1], m[2], cfg, opts, admins); })
      .catch(function (e) { console.warn('[SMC]', e); clearTimeout(loadingTimer); if (cached && effMode(cached).mode === 'public') unlock(); else showError(); });
  }

  function showError() {
    lock();
    overlay('<div class="smc-ico">📡</div><h2>' + esc(t('errTitle')) + '</h2><p>' + esc(t('errDesc')) + '</p>' +
      '<button class="smc-btn smc-pri" onclick="location.reload()">' + esc(t('retry')) + '</button>');
  }

  function run(A, Au, F, cfg, opts, admins) {
    var app = (A.getApps().filter(function (a) { return a.name === 'smc'; })[0]) || A.initializeApp(cfg.firebase, 'smc');
    var auth = Au.getAuth(app);
    var db = F.getFirestore(app);
    var policy = null, user, seq = 0, title = SITE;

    function emailOf(u) { return u && u.email ? u.email.toLowerCase() : null; }
    function isAdmin(u) { return !!(u && u.emailVerified && admins.indexOf(emailOf(u)) >= 0); }

    /* ----- 기록 ----- */
    function log(result, reason) {
      if (opts.logging === false) return;
      if (result === 'visit' && opts.trackPublic === false) return;
      var email = emailOf(user) || 'anonymous';
      var key = 'smc:log:' + SITE + ':' + location.pathname + ':' + result + ':' + email;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
      F.addDoc(F.collection(db, 'logs'), {
        site: SITE, path: location.pathname.slice(0, 290), email: email, result: result, reason: reason || '',
        ts: F.serverTimestamp(), ua: (navigator.userAgent || '').slice(0, 160), ref: (document.referrer || '').slice(0, 200)
      }).catch(function (e) { console.warn('[SMC] log', e.code || e); });
    }
    function touch(email) {
      var key = 'smc:touch:' + SITE + ':' + email;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
      F.updateDoc(F.doc(db, 'users', email), { lastSeen: F.serverTimestamp(), lastSite: SITE, visits: F.increment(1) }).catch(function () {});
    }

    /* ----- 권한 판단 ----- */
    function checkAccess(ud, mode) {
      if (!ud) return Promise.resolve({ ok: false, reason: 'notmember' });
      if (ud.status === 'suspended') return Promise.resolve({ ok: false, reason: 'suspended' });
      if (ud.expiresAt && ud.expiresAt < today()) return Promise.resolve({ ok: false, reason: 'expired' });
      if (mode === 'members' || ud.allSites) return Promise.resolve({ ok: true });
      if ((ud.sites || []).map(function (s) { return String(s).toLowerCase(); }).indexOf(SITE) >= 0) return Promise.resolve({ ok: true });
      var gs = ud.groups || [];
      if (!gs.length) return Promise.resolve({ ok: false, reason: 'nosite' });
      return Promise.all(gs.map(function (g) {
        return F.getDoc(F.doc(db, 'groups', g)).then(function (s) { return s.exists() ? s.data() : null; }, function () { return null; });
      })).then(function (list) {
        var ok = list.some(function (G) {
          return G && !(G.expiresAt && G.expiresAt < today()) && (G.allSites || (G.sites || []).map(function (s) { return String(s).toLowerCase(); }).indexOf(SITE) >= 0);
        });
        return ok ? { ok: true } : { ok: false, reason: 'nosite' };
      });
    }

    function evaluate() {
      var my = ++seq;
      clearTimeout(loadingTimer);
      var em = effMode(policy), mode = em.mode;
      if (mode === 'public') {
        unlock();
        if (user !== undefined) { log('visit'); if (user) showBadge(user); }
        return;
      }
      if (user === undefined) { lock(); return; }
      var email = emailOf(user);
      if (isAdmin(user)) { unlock(); showBadge(user, true); log('admin'); return; }
      lock(); hideBadge();
      if (mode === 'maintenance') return screenInfo('🛠️', t('maintTitle'), policy.message || t('maintDesc'));
      if (mode === 'closed') {
        var extra = em.why ? (t(em.why) + em.date) : '';
        return screenInfo('⛔', t('closedTitle'), (policy.message || t('closedDesc')) + (extra ? '\n' + extra : ''));
      }
      if (!user) return screenLogin();
      if (!user.emailVerified) return screenVerify();
      F.getDoc(F.doc(db, 'users', email)).then(function (s) { return s.exists() ? s.data() : null; }, function () { return null; })
        .then(function (ud) { return checkAccess(ud, mode); })
        .then(function (r) {
          if (my !== seq) return;
          if (r.ok) { unlock(); showBadge(user); log('allowed'); touch(email); }
          else { screenDenied(r.reason); log('denied', r.reason); }
        });
    }

    /* ----- 화면들 ----- */
    function head(ico, h, p) {
      return '<div class="smc-ico">' + ico + '</div><div class="smc-site">' + esc(title) + '</div><h2>' + esc(h) + '</h2>' +
        (p ? '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>' : '');
    }
    function bind(id, fn) { var el = document.getElementById(id); if (el) el.onclick = fn; }
    function msg(text, ok) { var el = document.getElementById('smc-m'); if (el) el.innerHTML = text ? '<div class="smc-msg ' + (ok ? 'smc-ok' : 'smc-err') + '">' + esc(text) + '</div>' : ''; }
    function errText(e) {
      var c = (e && e.code) || '';
      if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return t('e_invalid');
      if (/email-already-in-use/.test(c)) return t('e_exists');
      if (/weak-password/.test(c)) return t('e_weak');
      if (/invalid-email/.test(c)) return t('e_email');
      if (/popup-closed|cancelled-popup/.test(c)) return t('e_popup');
      if (/unauthorized-domain/.test(c)) return t('e_domain');
      if (/too-many-requests/.test(c)) return t('e_many');
      if (/network/.test(c)) return t('e_net');
      return (e && e.message) || String(e);
    }
    var isKakao = /KAKAOTALK/i.test(navigator.userAgent || '');
    var isInApp = isKakao || /(FBAN|FBAV|Instagram|Line\/|NAVER\(inapp)/i.test(navigator.userAgent || '');

    function screenInfo(ico, h, p) {
      overlay(head(ico, h, p) + '<button class="smc-btn smc-ghost" id="smc-al">' + esc(t('adminLogin')) + '</button>' +
        (user ? '<button class="smc-btn smc-ghost" id="smc-lo">' + esc(t('logout')) + '</button>' : ''));
      setTimeout(function () { bind('smc-al', function () { screenLogin(true); }); bind('smc-lo', function () { Au.signOut(auth); }); }, 0);
    }

    function screenLogin(adminMode, tab) {
      tab = tab || 'in';
      var kakao = isInApp ? '<div class="smc-msg smc-err">' + esc(t('kakao')) + '</div>' +
        (isKakao ? '<a class="smc-btn smc-kakao" href="kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href) + '">' + esc(t('openExternal')) + '</a>' : '') : '';
      overlay(head('🔐', adminMode ? t('adminLogin') : t('membersOnly'), t('loginDesc')) + kakao +
        '<button class="smc-btn smc-g" id="smc-gg"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>' + esc(t('google')) + '</button>' +
        '<div class="smc-or">' + esc(t('or')) + '</div>' +
        '<div class="smc-tabs"><button id="smc-ti" class="' + (tab === 'in' ? 'on' : '') + '">' + esc(t('loginTab')) + '</button><button id="smc-tu" class="' + (tab === 'up' ? 'on' : '') + '">' + esc(t('signupTab')) + '</button></div>' +
        (tab === 'up' ? '<input id="smc-nm" placeholder="' + esc(t('name')) + '" autocomplete="name">' : '') +
        '<input id="smc-em" type="email" placeholder="' + esc(t('email')) + '" autocomplete="email">' +
        '<input id="smc-pw" type="password" placeholder="' + esc(t('password')) + '" autocomplete="' + (tab === 'up' ? 'new-password' : 'current-password') + '">' +
        '<div id="smc-m"></div>' +
        '<button class="smc-btn smc-pri" id="smc-go">' + esc(tab === 'up' ? t('signup') : t('login')) + '</button>' +
        (tab === 'in' ? '<button class="smc-btn smc-ghost" id="smc-fg">' + esc(t('forgot')) + '</button>' : ''));
      setTimeout(function () {
        bind('smc-ti', function () { screenLogin(adminMode, 'in'); });
        bind('smc-tu', function () { screenLogin(adminMode, 'up'); });
        bind('smc-gg', function () {
          var p = new Au.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
          Au.signInWithPopup(auth, p).catch(function (e) {
            if (/popup-blocked|operation-not-supported/.test(e.code || '')) return Au.signInWithRedirect(auth, p);
            msg(errText(e));
          });
        });
        var go = function () {
          var em = (document.getElementById('smc-em') || {}).value || '', pw = (document.getElementById('smc-pw') || {}).value || '';
          em = em.trim();
          if (tab === 'up') {
            var nm = ((document.getElementById('smc-nm') || {}).value || '').trim();
            Au.createUserWithEmailAndPassword(auth, em, pw).then(function (c) {
              return Promise.all([nm ? Au.updateProfile(c.user, { displayName: nm }) : null, Au.sendEmailVerification(c.user)]);
            }).catch(function (e) { msg(errText(e)); });
          } else {
            Au.signInWithEmailAndPassword(auth, em, pw).catch(function (e) { msg(errText(e)); });
          }
        };
        bind('smc-go', go);
        var pwEl = document.getElementById('smc-pw'); if (pwEl) pwEl.onkeydown = function (e) { if (e.key === 'Enter') go(); };
        bind('smc-fg', function () {
          var em = ((document.getElementById('smc-em') || {}).value || '').trim();
          if (!em) { msg(t('e_email')); return; }
          Au.sendPasswordResetEmail(auth, em).then(function () { msg(t('resetSent'), true); }, function (e) { msg(errText(e)); });
        });
      }, 0);
    }

    function screenVerify() {
      overlay(head('📧', t('verifyTitle'), t('verifyDesc')) + '<div class="smc-who">' + esc(user.email) + '</div><div id="smc-m"></div>' +
        '<button class="smc-btn smc-pri" id="smc-vd">' + esc(t('verifyDone')) + '</button>' +
        '<button class="smc-btn smc-g" id="smc-rs">' + esc(t('resend')) + '</button>' +
        '<button class="smc-btn smc-ghost" id="smc-lo">' + esc(t('switchAccount')) + '</button>');
      setTimeout(function () {
        bind('smc-vd', function () { user.reload().then(function () { return user.getIdToken(true); }).then(function () { user = auth.currentUser; evaluate(); }); });
        bind('smc-rs', function () { Au.sendEmailVerification(user).then(function () { msg(t('resent'), true); }, function (e) { msg(errText(e)); }); });
        bind('smc-lo', function () { Au.signOut(auth); });
      }, 0);
    }

    function screenDenied(reason) {
      var canReq = reason === 'notmember' || reason === 'nosite' || reason === 'expired';
      overlay(head(reason === 'suspended' ? '🚫' : '🔒', t('deniedTitle'), t(reason)) +
        '<div class="smc-who">' + esc(t('signedInAs')) + ': ' + esc(user.email) + '</div>' +
        (canReq ? '<textarea id="smc-rq" rows="2" placeholder="' + esc(t('requestMsg')) + '"></textarea><div id="smc-m"></div><button class="smc-btn smc-pri" id="smc-rb">' + esc(t('request')) + '</button>' : '<div id="smc-m"></div>') +
        '<button class="smc-btn smc-g" id="smc-sw">' + esc(t('switchAccount')) + '</button>');
      setTimeout(function () {
        bind('smc-sw', function () { Au.signOut(auth); });
        bind('smc-rb', function () {
          var btn = document.getElementById('smc-rb'); if (btn) btn.disabled = true;
          var email = emailOf(user);
          F.setDoc(F.doc(db, 'requests', SITE + '__' + email), {
            site: SITE, siteTitle: title, email: email, name: user.displayName || '', reason: reason,
            message: ((document.getElementById('smc-rq') || {}).value || '').slice(0, 300), status: 'pending', ts: F.serverTimestamp()
          }).then(function () { msg(t('requested'), true); }, function () { msg(t('alreadyRequested'), true); });
        });
      }, 0);
    }

    /* ----- 로그인 배지 ----- */
    var badge = null;
    function hideBadge() { if (badge && badge.parentNode) badge.parentNode.removeChild(badge); badge = null; }
    function showBadge(u, admin) {
      if (opts.showBadge === false && !admin) return;
      whenBody(function () {
        hideBadge();
        badge = document.createElement('div'); badge.id = 'smc-badge';
        var ini = (u.displayName || u.email || '?').trim().charAt(0).toUpperCase();
        badge.innerHTML = '<div class="m"><div class="h">' + esc(u.email) + '</div>' +
          (admin ? '<a href="' + BASE + '#sites" target="_blank" rel="noopener">⚙️ ' + esc(t('console')) + '</a>' : '') +
          '<button type="button" data-x="lo">↩︎ ' + esc(t('logout')) + '</button></div>' +
          '<button type="button" class="b" title="' + esc(u.email) + '"><span class="av">' + (admin ? '⚙' : esc(ini)) + '</span><span class="em">' + esc(u.email) + '</span></button>';
        document.body.appendChild(badge);
        badge.querySelector('.b').onclick = function () { badge.classList.toggle('open'); badge.classList.remove('mini'); };
        badge.querySelector('[data-x=lo]').onclick = function () { Au.signOut(auth).then(function () { location.reload(); }); };
        setTimeout(function () { if (badge && !badge.classList.contains('open')) badge.classList.add('mini'); }, 3500);
      });
    }

    /* ----- 흐름 ----- */
    Au.onAuthStateChanged(auth, function (u) { user = u; if (policy) evaluate(); });
    var timeout = new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 12000); });
    Promise.race([F.getDoc(F.doc(db, 'sites', SITE)), timeout]).then(function (s) {
      policy = s.exists() ? s.data() : { mode: opts.defaultMode || 'public' };
      policy.mode = policy.mode || 'public';
      title = policy.title || rawSite;
      saveCache(policy);
      evaluate();
    }).catch(function (e) {
      console.warn('[SMC] policy', e);
      clearTimeout(loadingTimer);
      if (cached) { policy = cached; evaluate(); }
      else if ((opts.defaultMode || 'public') === 'public') unlock();
      else showError();
    });
  }
})();
