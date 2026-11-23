/* Site Main Control 설정 파일
   - 처음에는 비어 있어요(firebase: null). 이 상태에서는 모든 사이트가 그대로 열려요(안전).
   - 관리 콘솔 [설치·설정]에서 Firebase를 연결하면 이 파일이 자동으로 채워져요.
   - Firebase 웹 설정값은 공개되어도 괜찮아요. 실제 보안은 Firestore 보안 규칙이 담당해요. */
window.SMC_CONFIG = {
  "owner": "yalli2",
  "adminEmails": [],
  "firebase": null,
  "options": {
    "defaultMode": "public",
    "logging": true,
    "trackPublic": true,
    "showBadge": true
  }
};
