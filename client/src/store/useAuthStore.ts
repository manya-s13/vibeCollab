import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  isLoggedIn: boolean;
  checkAuthStatus: () => Promise<void>;
  setLoggedIn: (status: boolean) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  checkAuthStatus: async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/checkauth", {
        withCredentials: true,
      });
      const user = res.data?.data?.user;
        set({ isLoggedIn: !!user });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ isLoggedIn: false });
    }
  },

  setLoggedIn: (status: boolean) => set({ isLoggedIn: status }),

  logout: async () => {
    try {
      await axios.post("http://localhost:3002/api/signout", {}, {
        withCredentials: true,
      });
      set({ isLoggedIn: false });
      alert('Signed Out');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
}));

export default useAuthStore;
