import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import 'dotenv/config';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

export const adminAuth = auth;

const listaAdmins = [
  'fonsecavinicius12@gmail.com', 
  'alinediasmarquesramos638@gmail.com',
  'thiagoeajds@gmail.com'
];

export async function verificarAutenticacao(req) {
  const authHeader = req.headers['authorization'];

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    const error = new Error('Não autorizado: Token ausente');
    error.status = 401;
    throw error;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    const err = new Error('Token inválido ou expirado');
    err.status = 401;
    throw err;
  }

}

export async function verificarAdmin(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Não autorizado: Token ausente');
    error.status = 401;
    throw error;
  }
  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const email = decodedToken.email;
    if (!listaAdmins.includes(email)) {
      const error = new Error('Acesso Restrito: Você não é administrador');
      error.status = 403;
      throw error;
    }
    return decodedToken;
  } catch (error) {
    const err = new Error('Token inválido ou expirado');
    err.status = 401;
    throw err;
  }
}