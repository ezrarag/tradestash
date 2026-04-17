"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";

import { getDemoStore } from "@/lib/demo-store";
import { isDemoMode } from "@/lib/env";
import { getFirebaseAuth } from "@/lib/firebase/client";

type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
};

type AuthContextValue = {
  demoMode: boolean;
  loading: boolean;
  user: SessionUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (args: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  actAsDemoUser: (userId: string) => void;
  getAuthHeaders: () => Promise<Record<string, string>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getDemoSessionUser(userId?: string | null): SessionUser | null {
  const store = getDemoStore();
  const fallback = userId
    ? store.users.find((user) => user.id === userId)
    : store.users[0];

  return fallback
    ? {
        id: fallback.id,
        email: fallback.email,
        displayName: fallback.displayName,
        photoURL: fallback.photoURL,
      }
    : null;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      const demoUserId =
        typeof window !== "undefined"
          ? window.localStorage.getItem("tradestash-demo-user")
          : null;
      setUser(getDemoSessionUser(demoUserId));
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: nextUser.uid,
        email: nextUser.email ?? "",
        displayName: nextUser.displayName ?? nextUser.email?.split("@")[0] ?? "Trader",
        photoURL: nextUser.photoURL ?? undefined,
      });
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      demoMode: isDemoMode,
      loading,
      user,
      async signIn(email, password) {
    if (isDemoMode) {
          const store = getDemoStore();
          const match = store.users.find((entry) => entry.email === email);
          const fallback = match ?? store.users[0];
          if (typeof window !== "undefined") {
            window.localStorage.setItem("tradestash-demo-user", fallback.id);
          }
          setUser(getDemoSessionUser(fallback.id));
          return;
        }

        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error("Firebase auth is not configured.");
        }

        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser({
          id: result.user.uid,
          email: result.user.email ?? "",
          displayName: result.user.displayName ?? result.user.email?.split("@")[0] ?? "Trader",
          photoURL: result.user.photoURL ?? undefined,
        });
      },
      async signUp({ displayName, email, password }) {
        if (isDemoMode) {
          const store = getDemoStore();
          const match = store.users.find((entry) => entry.email === email) ?? store.users[0];
          if (typeof window !== "undefined") {
            window.localStorage.setItem("tradestash-demo-user", match.id);
          }
          setUser(getDemoSessionUser(match.id));
          return;
        }

        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error("Firebase auth is not configured.");
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        setUser({
          id: result.user.uid,
          email,
          displayName,
          photoURL: result.user.photoURL ?? undefined,
        });
      },
      async signOut() {
        if (isDemoMode) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("tradestash-demo-user");
          }
          setUser(getDemoSessionUser());
          return;
        }

        const auth = getFirebaseAuth();
        if (!auth) {
          return;
        }

        await firebaseSignOut(auth);
        setUser(null);
      },
      actAsDemoUser(userId) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("tradestash-demo-user", userId);
        }
        setUser(getDemoSessionUser(userId));
      },
      async getAuthHeaders() {
        const headers: Record<string, string> = {};

        if (isDemoMode) {
          if (user) {
            headers["x-demo-user-id"] = user.id;
          }
          return headers;
        }

        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        if (!currentUser) {
          return headers;
        }

        const token = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
        return headers;
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
