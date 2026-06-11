/** No-op auth hook — authentication removed, app is fully public. */
export function useAuth() {
  return {
    isAuthenticated: false,
    isLoading: false,
    principal: null,
    identity: null,
    loginStatus: "idle" as const,
    login: async () => {},
    logout: () => {},
  };
}
