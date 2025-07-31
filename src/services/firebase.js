import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBGBsBh9iFF20VlmPm65XL3gEs0bJ60NA0',
  authDomain: 'bldr-fitness-app.firebaseapp.com',
  projectId: 'bldr-fitness-app',
  storageBucket: 'bldr-fitness-app.firebasestorage.app',
  messagingSenderId: '896720103850',
  appId: '1:896720103850:web:f57925474a52b9f21be3d3',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========== AUTENTICAÇÃO ==========
export const loginWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerWithEmail = async (email, password, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (additionalData.name) {
      await updateProfile(user, { displayName: additionalData.name });
    }

    // Cria o perfil no Firestore com dados adicionais, como nome
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName: additionalData.name,
      createdAt: serverTimestamp(),
      isPremium: false,
      ...additionalData,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Wrapper para facilitar o uso do onAuthStateChanged no AuthContext
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ========== PERFIL ==========
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

// Atualizar perfil com log para depuração
export const updateUserProfile = async (userId, data) => {
  try {
    console.log('🔁 Atualizando perfil:', userId, data);
    const userRef = doc(db, 'users', userId);
    // Força tipo booleano para isPremium, se existir
    if ('isPremium' in data) {
      data.isPremium = Boolean(data.isPremium);
    }
    await updateDoc(userRef, sanitizeData(data));
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
  }
};

// Criar perfil corrigido (espera o objeto user do Firebase Auth)
export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      isPremium: false,
      // Você pode adicionar outros campos padrão aqui, se quiser
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return { success: false, error: error.message };
  }
};

// ========== UPLOAD ==========
export const uploadProgressPhoto = async (userId, file) => {
  const fileRef = ref(storage, `progress/${userId}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

// ========== XP & LEVEL ==========
export const addXPToUser = async (userId, amount) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      xp: increment(amount),
    });
  } catch (error) {
    console.error('Erro ao adicionar XP:', error);
  }
};

// ========== UTIL ==========
const sanitizeData = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
