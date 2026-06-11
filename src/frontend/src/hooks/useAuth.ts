import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== null;
  const isLoading = loginStatus === "logging-in";

  const principal =
    isAuthenticated && identity ? identity.getPrincipal().toText() : null;

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch (err) {
      console.error("Login failed:", err);
    }
  }, [login]);

  const handleLogout = useCallback(() => {
    clear();
  }, [clear]);

  return {
    isAuthenticated,
    isLoading,
    principal,
    identity,
    loginStatus,
    login: handleLogin,
    logout: handleLogout,
  };
}
