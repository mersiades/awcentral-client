export const createKeycloakStub = () => ({
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
  loadUserInfo: jest.fn(),
  authenticated: true
});

let mockInitialized = true;

// const web = () => {
//   const originalModule = jest.requireActual('@react-keycloak/web');
//   return {
//     ...originalModule,
//     // useKeycloak: () => [createKeycloakStub(), mockInitialized],
//     useKeycloak: { keycloak: createKeycloakStub(), initialilized: mockInitialized },
//     // ReactKeycloakProvider: jest.fn()
//   };
// }


// export default web