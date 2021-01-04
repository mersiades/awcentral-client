import { Game, GameRole, KeycloakUser, KeycloakUserInfo } from "../@types";
import { Roles } from "../@types/enums";

export const mockNewGameName = 'My new mock game'

export const mockKeycloakUserInfo: KeycloakUserInfo = {
  email: 'mockUser1@email.com',
  email_verified: true,
  family_name: 'mock-family-name-1',
  given_name: 'mock-given-name-1',
  name: 'mock-name-1',
  preferred_username: 'mock-user-1',
  sub: 'mock-keycloak-id-1',
};

export const mockKeycloakUser1: KeycloakUser = {
  id: 'mock-keycloak-id-1',
  username: 'mock-user-1',
  email: 'mockUser1@email.com'
}

export const mockKeycloakUser2: KeycloakUser = {
  id: 'mock-keycloak-id-2',
  username: 'mock-user-2',
  email: 'mockUser2@email.com'
}

export const mockGame1: Game = {
  id: 'mock-game-id-1',
  name: 'Mock Game 1',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1'},
  players: [{ displayName: 'mock-user-2', id: 'mock-keycloak-id-2'}],
  gameRoles: [{
    id: "mock-gamerole-id-1",
    role: Roles.mc,
    userId: 'mock-keycloak-id-1',
  }, {
    id: "mock-gamerole-id-3",
    role: Roles.player,
    userId: 'mock-keycloak-id-2',
  }],
  invitees: []
}

export const mockGame2: Game = {
  id: 'mock-game-id-2',
  name: 'Mock Game 2',
  commsApp: 'Zoom',
  commsUrl: 'https://zoom.com/urltodiscordchannel',
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2'},
  players: [{ displayName: 'mock-user-1', id: 'mock-keycloak-id-1'}],
  gameRoles: [{
    id: "mock-gamerole-id-2",
    role: Roles.player,
    userId: 'mock-keycloak-id-1'
  }, {
    id: "mock-gamerole-id-4",
    role: Roles.mc,
    userId: 'mock-keycloak-id-2'
  }],
  invitees: []
}

export const mockGame3: Game = {
  id: 'mock-game-id-3',
  name: mockNewGameName,
  commsApp: "",
  commsUrl: "",
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1'},
  players: [],
  gameRoles: [{
    id: "mock-gamerole-id-5",
    role: Roles.mc,
    userId: 'mock-keycloak-id-1'
  }],
  invitees: []
}

export const mockGameRole1: GameRole = {
  id: "mock-gamerole-id-1",
  role: Roles.mc,
  userId: 'mock-keycloak-id-1',
  game: mockGame1
}

export const mockGameRole2: GameRole = {
  id: "mock-gamerole-id-2",
  role: Roles.player,
  userId: 'mock-keycloak-id-1',
  game: mockGame2
}

export const mockGameRole3: GameRole = {
  id: "mock-gamerole-id-3",
  role: Roles.player,
  userId: 'mock-keycloak-id-2',
  game: mockGame1
}

export const mockGameRole4: GameRole = {
  id: "mock-gamerole-id-4",
  role: Roles.mc,
  userId: 'mock-keycloak-id-2',
  game: mockGame2
}

