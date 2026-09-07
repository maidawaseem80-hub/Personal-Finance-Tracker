import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // Restore logged-in user
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();

        const currentUser =
          data.user || data.data || data;

        setUser(currentUser);

        // Keep localStorage user data synchronized
        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Failed to restore session:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // =========================================================
  // Login
  // =========================================================

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // =========================================================
  // Logout
  // =========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // =========================================================
  // Update user preferences locally
  // =========================================================

  const updateUserPreferences = (preferences) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const updatedUser = {
        ...previousUser,
        preferences: {
          ...(previousUser.preferences || {}),
          ...preferences,
        },
      };

      // Keep localStorage synchronized
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  // =========================================================
  // Current Currency
  // =========================================================

  const currency =
    user?.preferences?.currency || "PKR";

  // =========================================================
  // Currency Formatter
  // =========================================================

  const formatCurrency = (amount) => {
    const numericAmount =
      Number(amount) || 0;

    const currencyConfig = {
      PKR: {
        locale: "en-PK",
        currency: "PKR",
      },

      USD: {
        locale: "en-US",
        currency: "USD",
      },

      EUR: {
        locale: "de-DE",
        currency: "EUR",
      },

      GBP: {
        locale: "en-GB",
        currency: "GBP",
      },
    };

    const config =
      currencyConfig[currency] ||
      currencyConfig.PKR;

    return new Intl.NumberFormat(
      config.locale,
      {
        style: "currency",
        currency: config.currency,
        maximumFractionDigits: 2,
      }
    ).format(numericAmount);
  };

  // =========================================================
  // Context value
  // =========================================================

  const value = {
    user,
    loading,

    isAuthenticated: Boolean(user),

    login,
    logout,

    updateUserPreferences,

    currency,
    formatCurrency,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// useAuth Hook
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}
