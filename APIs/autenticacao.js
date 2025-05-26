import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.firebasestorage.app",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function login() {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) {
        await setDoc(userRef, {
            nome: user.displayName,
            email: user.email,
            telefone: user.phoneNumber || null,
            cpf: null,
            enderecos: [],
            criadoEm: new Date()
        });
        console.log("Usuário cadastrado com sucesso!");
    }else {
        console.log("Usuário já existe!");
    }

    return user;
}

export async function logout() {
    await signOut(auth);
}