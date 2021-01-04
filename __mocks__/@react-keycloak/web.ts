import { KeycloakUserInfo } from "../../src/@types";

/**
 * Creates a mock Keycloak object for testing.
 * Defaults to an initialized and authenticated state (via TestRoot.tsx),
 * but the optional parameter allow testing of unauthenticated state
 * @param isAuthenticated 
 */
export const mockKeycloakStub = (isAuthenticated: boolean = true, userInfo?: KeycloakUserInfo) => ({
  init: jest.fn().mockResolvedValue(true),
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
  loadUserInfo: jest.fn().mockResolvedValue(userInfo),
  authenticated: isAuthenticated,
});