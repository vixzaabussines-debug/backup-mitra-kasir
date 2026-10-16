/*
  KONFIGURASI FIREBASE
  Letakkan file ini di folder yang SAMA dengan index.html dan admin-mitra-kasir.html.

  1) Konfigurasi project:
     Firebase Console > Project settings (ikon roda gigi) > Your apps > Web app > SDK setup and configuration > "Config".
  2) Email admin:
     Buat akun admin di Firebase Console > Authentication > Users > Add user (email + password),
     lalu tulis email yang sama di ADMIN_EMAIL di bawah ini dan di Firestore Rules.
*/
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBLaFRhGsO9-H0I7enXuLdhRU0HfPekmUs",
  authDomain: "backup-mitra-kasir.firebaseapp.com",
  projectId: "backup-mitra-kasir",
  storageBucket: "backup-mitra-kasir.firebasestorage.app",
  messagingSenderId: "407387438925",
  appId: "1:407387438925:web:e4d232d307a0a8dbcf8104"
};
window.ADMIN_EMAIL = "admin@backupmitrakasir.com";

/* Akun kasir login dengan nama (misal "Surodinawan"). Di Firebase nama diubah jadi email: nama@EMAIL_DOMAIN. Domain ini tidak perlu asli. */
window.EMAIL_DOMAIN = "kasir.backupmitrakasir.com";
