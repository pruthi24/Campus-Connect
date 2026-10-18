import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultAuth = {
  currentUser: null,
  userRole: 'student',
  loading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {}
};

const AuthContext = createContext(defaultAuth);

const ADMIN_EMAILS = [
  'admin@gita.edu'
];

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuth;
}

const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem('campus_connect_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  // 1. Immediately bootstrap synchronously from localStorage
  const [currentUser, setCurrentUser] = useState(() => getStoredProfile());
  const [userRole, setUserRole] = useState(() => getStoredProfile()?.role || 'student');
  // loading is false if session is cached (prevents any login screen flash!)
  const [loading, setLoading] = useState(() => !getStoredProfile());

  const saveUserSession = (userData) => {
    try {
      localStorage.setItem('campus_connect_profile', JSON.stringify(userData));
    } catch (e) {}
    setCurrentUser(userData);
    if (userData?.role) {
      setUserRole(userData.role);
    }
  };

  // Centralized profile updater
  const updateUserProfile = async (updatedFields) => {
    const current = currentUser || getStoredProfile() || {};
    const newName = updatedFields.name !== undefined ? updatedFields.name : (current.name || 'Arnav Dutta');
    const newUsername = updatedFields.username || current.username || `@${newName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Generate avatar if not already a custom uploaded one
    const isCustomAvatar = (updatedFields.avatar && updatedFields.avatar.startsWith('data:')) ||
                           (current.avatar && current.avatar.startsWith('data:'));
    const finalAvatar = updatedFields.avatar || (isCustomAvatar ? current.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=7A1A22&color=fff&bold=true`);

    const merged = {
      ...current,
      ...updatedFields,
      name: newName,
      displayName: newName,
      username: newUsername.startsWith('@') ? newUsername : `@${newUsername}`,
      avatar: finalAvatar,
      lastEditedAt: Date.now()
    };

    saveUserSession(merged);

    // Update Firebase Auth if user exists
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: newName,
        photoURL: finalAvatar
      }).catch(() => {});
    }

    // Persist to Firestore if available
    try {
      const uid = auth.currentUser?.uid || current.uid || current.id;
      if (uid) {
        await setDoc(doc(db, 'users', uid), merged, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore user doc update note:', err);
    }

    return merged;
  };

  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const finalName = displayName && displayName.trim() ? displayName.trim() : 'Arnav Dutta';
    const cleanUsername = `@${finalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=7A1A22&color=fff&bold=true`;

    await updateProfile(user, { displayName: finalName, photoURL: avatarUrl }).catch(() => {});

    const assignedRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'student';
    const profileData = {
      uid: user.uid,
      id: user.uid,
      email: user.email,
      name: finalName,
      displayName: finalName,
      username: cleanUsername,
      role: assignedRole,
      branch: 'Computer Science & Engineering',
      rollNumber: 'GITA/CSE/2023/042',
      year: '3rd Year',
      details: '3rd Year, CSE',
      avatar: avatarUrl,
      badge: 'Elite Contributor',
      badgeDesc: 'Active member of GITA Campus Connect',
      bio: 'Student at GITA Autonomous College, Bhubaneswar. Enthusiastic learner and campus community member.',
      tagline: 'Student at GITA Autonomous College',
      createdAt: new Date().toISOString(),
      lastEditedAt: Date.now()
    };

    saveUserSession(profileData);
    setLoading(false);

    try {
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
    } catch (e) {
      console.warn('Firestore signup save error:', e);
    }

    return userCredential;
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Check if we already have a local session for this email
    const cached = getStoredProfile();
    let profile;

    if (cached && (cached.email?.toLowerCase() === user.email?.toLowerCase() || cached.uid === user.uid)) {
      profile = { ...cached, uid: user.uid, id: user.uid };
    } else {
      let resolvedName = user.displayName;
      if (!resolvedName && user.email) {
        const handle = user.email.split('@')[0];
        resolvedName = handle.split(/[._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
      if (!resolvedName || resolvedName === 'Student') resolvedName = 'Arnav Dutta';

      const cleanUsername = `@${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const assignedRole = ADMIN_EMAILS.includes(user.email?.toLowerCase()) ? 'admin' : 'student';

      profile = {
        uid: user.uid,
        id: user.uid,
        email: user.email,
        name: resolvedName,
        displayName: resolvedName,
        username: cleanUsername,
        role: assignedRole,
        branch: 'Computer Science & Engineering',
        rollNumber: 'GITA/CSE/2023/042',
        year: '3rd Year',
        details: '3rd Year, CSE',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=7A1A22&color=fff&bold=true`,
        badge: 'Elite Contributor',
        badgeDesc: 'Active member of GITA Campus Connect',
        bio: 'Student at GITA Autonomous College, Bhubaneswar.',
        tagline: 'Student at GITA Autonomous College',
        createdAt: new Date().toISOString(),
        lastEditedAt: Date.now()
      };
    }

    saveUserSession(profile);
    setLoading(false);
    return res;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    const finalName = user.displayName || (user.email ? user.email.split('@')[0] : 'GITA Student');
    const cleanUsername = `@${finalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=7A1A22&color=fff&bold=true`;
    const assignedRole = ADMIN_EMAILS.includes(user.email?.toLowerCase()) ? 'admin' : 'student';

    const cached = getStoredProfile();
    let profile;

    if (cached && (cached.email?.toLowerCase() === user.email?.toLowerCase() || cached.uid === user.uid)) {
      profile = {
        ...cached,
        uid: user.uid,
        id: user.uid,
        name: cached.name || finalName,
        displayName: cached.displayName || finalName,
        avatar: user.photoURL || cached.avatar || avatarUrl
      };
    } else {
      profile = {
        uid: user.uid,
        id: user.uid,
        email: user.email,
        name: finalName,
        displayName: finalName,
        username: cleanUsername,
        role: assignedRole,
        branch: 'Computer Science & Engineering',
        rollNumber: 'GITA/CSE/2023/042',
        year: '3rd Year',
        details: '3rd Year, CSE',
        avatar: avatarUrl,
        badge: 'Elite Contributor',
        badgeDesc: 'Active member of GITA Campus Connect',
        bio: 'Student at GITA Autonomous College, Bhubaneswar.',
        tagline: 'Student at GITA Autonomous College',
        createdAt: new Date().toISOString(),
        lastEditedAt: Date.now()
      };
    }

    saveUserSession(profile);
    setLoading(false);

    try {
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    } catch (e) {
      console.warn('Firestore Google login sync note:', e);
    }

    return res;
  }

  async function logout() {
    localStorage.removeItem('campus_connect_profile');
    setCurrentUser(null);
    setUserRole(null);
    return signOut(auth);
  }

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const cached = getStoredProfile();
          const baseProfile = (cached && (cached.uid === user.uid || cached.email?.toLowerCase() === user.email?.toLowerCase()))
            ? cached
            : null;

          let resolvedName = baseProfile?.name || user.displayName;
          if (!resolvedName && user.email) {
            const handle = user.email.split('@')[0];
            resolvedName = handle.split(/[._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          }
          if (!resolvedName || resolvedName === 'Student') {
            resolvedName = 'Arnav Dutta';
          }

          let assignedRole = baseProfile?.role || (ADMIN_EMAILS.includes(user.email?.toLowerCase()) ? 'admin' : 'student');

          let firestoreData = {};
          try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              firestoreData = userDoc.data();
            }
          } catch (docErr) {
            console.warn("Firestore sync warning:", docErr);
          }

          // Merge order: defaults < firestoreData < baseProfile (LOCAL EDITS ALWAYS WIN!)
          const fullUser = {
            uid: user.uid,
            id: user.uid,
            email: user.email,
            name: resolvedName,
            displayName: resolvedName,
            username: `@${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            role: assignedRole,
            branch: 'Computer Science & Engineering',
            rollNumber: 'GITA/CSE/2023/042',
            year: '3rd Year',
            details: '3rd Year, CSE',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=7A1A22&color=fff&bold=true`,
            badge: 'Elite Contributor',
            badgeDesc: 'Active member of GITA Campus Connect',
            bio: 'Student at GITA Autonomous College, Bhubaneswar.',
            tagline: 'Student at GITA Autonomous College',
            ...firestoreData,
            ...baseProfile, // Local edits from localStorage are preserved and take precedence!
            lastEditedAt: baseProfile?.lastEditedAt || Date.now()
          };

          saveUserSession(fullUser);
        } else {
          // If explicitly unauthenticated and no cached session
          if (!localStorage.getItem('campus_connect_profile')) {
            setCurrentUser(null);
            setUserRole(null);
          }
        }
      } catch (err) {
        console.error("Auth state error:", err);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
