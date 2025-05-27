import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.firebasestorage.app",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const listaAdmins = ['fonsecavinicius12@gmail.com', 'alinediasmarquesramos638@gmail.com', 'thiagoeajds@gmail.com'];


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../telaMenu/Menu.html';
    return;
  }

  document.getElementById('userNome').innerText = user.displayName || 'Sem nome';
  document.getElementById('userEmail').innerText = user.email;

  const token = await user.getIdToken();
  localStorage.setItem('token', token);

  if (listaAdmins.includes(user.email)) {
    document.getElementById('adminOptions').style.display = 'block';
  }
});

window.logout = function() {
  signOut(auth).then(() => {
    localStorage.removeItem('token');
    window.location.href = '../login.html';
  });
};
