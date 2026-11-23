/* Site Main Control 설정 파일
   - Firebase 프로젝트: dainedu-sites (Firestore 서울 리전)
   - Firebase 웹 설정값은 공개되어도 괜찮아요. 실제 보안은 Firestore 보안 규칙이 담당해요.
   - 관리자 이메일을 바꾸면 Firestore 보안 규칙도 다시 게시해야 해요 (콘솔 [설치·설정] ③). */
window.SMC_CONFIG = {
  "owner": "yalli2",
  "adminEmails": ["buyeon.hwang@gmail.com"],
  "firebase": {
    "apiKey": "AIzaSyBzq4WhMc4gin6mAojfjmxbp_k6IThdHQc",
    "authDomain": "dainedu-sites.firebaseapp.com",
    "projectId": "dainedu-sites",
    "storageBucket": "dainedu-sites.firebasestorage.app",
    "messagingSenderId": "691226415297",
    "appId": "1:691226415297:web:3747e4140eb3081e290440"
  },
  "options": {
    "defaultMode": "public",
    "logging": true,
    "trackPublic": true,
    "showBadge": true
  }
};
