import { auth } from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const listaAdmins = [
  'fonsecavinicius12@gmail.com'
];

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();

export async function verificarAutenticacao(req) {
  const authHeader = req.headers['authorization'];

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    throw new Error('Não autorizado: Token ausente');
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }

}

export async function verificarAdmin(req) {
  const authHeader = req.headers['authorization'];

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    throw new Error('Não autorizado: Token ausente');
  }

  const idToken = authHeader.split(' ')[1];

  try{
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if(!listaAdmins.includes(email)) {
      throw new Error('Acesso Restrito: Você não é administrador')
    }

    return decodedToken;
  } catch (error) {
    throw new Error('Token inválido ou acesso negado')
  }
}