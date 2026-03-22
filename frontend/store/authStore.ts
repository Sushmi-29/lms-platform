import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, accessToken: string) => void;
  updateUser: (user: any) => void;
  logout: () => void;
  loadUser: () => void;
}

// TEMP: If you had stale persisted values, set this to true once,
// reload, then set it back to false.
const TEMP_CLEAR_STORAGE = false;

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null as any | null, token: null as string | null };
  }

  if (TEMP_CLEAR_STORAGE) {
    localStorage.clear();
  }

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  let parsedUser = null;

try {
  parsedUser =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
} catch (error) {
  parsedUser = null;
}

return {
  user: parsedUser,
  token: storedToken ? storedToken : null,
};
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getStoredAuth(),

  login: (user, accessToken) => {
    localStorage.setItem("user", JSON.stringify(user));
    // Keep accessToken for API requests, but also mirror into "token"
    // so route guards are consistent across the app.
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
    set({ user, token: accessToken });
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    set({ user: null, token: null });
  },


  loadUser: () => {
    set(getStoredAuth());
  },
}));