/**
 * Creates a mock Keycloak object for testing.
 * Defaults to an initialized and authenticated state (via TestRoot.tsx),
 * but the optional parameters allow testing of other states
 * @param isInitialized 
 * @param isAuthenticated 
 */
export const createKeycloakStub = (isInitialized: boolean, isAuthenticated: boolean) => ({
  init: jest.fn().mockResolvedValue(isInitialized),
  updateToken: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  accountManagement: jest.fn(),
  createLoginUrl: jest.fn(),
  createLogoutUrl: jest.fn(),
  createRegisterUrl: jest.fn(),
  createAccountUrl: jest.fn(),
  isTokenExpired: jest.fn(),
  clearToken: jest.fn(),
  hasRealmRole: jest.fn(),
  hasResourceRole: jest.fn(),
  loadUserProfile: jest.fn(),
  loadUserInfo: jest.fn(),
  authenticated: isAuthenticated
});