"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  UserCredential
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signupWithEmail: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
}

// Create context with default values (WITHOUT implementation - just type definition)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Email/Password Login
  const loginWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Email/Password Signup - RENAMED TO MATCH INTERFACE
  const signupWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Google Login/Signup
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope("profile");
    provider.addScope("email");
    
    return signInWithPopup(auth, provider);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Password Reset
  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update Password
  const updateUserPassword = (password: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return updatePassword(auth.currentUser, password);
  };

  // Update Email
  const updateUserEmail = (email: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return updateEmail(auth.currentUser, email);
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithEmail,
    signupWithEmail, // This matches the interface
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserPassword,
    updateUserEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};