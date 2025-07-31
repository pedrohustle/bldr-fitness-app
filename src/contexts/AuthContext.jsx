import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  logout as firebaseLogout,
  onAuthStateChangedListener,
} from '../services/firebase';

import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChangedListener(async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            console.log("📦 Firestore userProfile update:", docSnap.data());
            setUserProfile(docSnap.data());
          } else {
            console.log("⚠️ Perfil não encontrado. Criando novo perfil...");
            await createUserProfile(user); // 🔥 Cria o perfil se não existir
          }
        });
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const logout = async () => {
    await firebaseLogout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    loginWithEmail,
    register: registerWithEmail,
    loginWithGoogle,
    createUserProfile,
    updateUserProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
