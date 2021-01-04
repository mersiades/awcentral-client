import { MockedResponse } from "@apollo/client/testing";
import CREATE_GAME from "../mutations/createGame";
import GAMEROLES_BY_USER_ID from "../queries/gameRolesByUserId";
import { mockGame1, mockGame2, mockGame3, mockGameRole1, mockGameRole2, mockKeycloakUser1, mockNewGameName } from "./mocks";

export const mockGameRolesByUserId: MockedResponse = {
  request: {
    query: GAMEROLES_BY_USER_ID,
    variables: { id: mockKeycloakUser1.id }
  },
  result: {
    data: {
      gameRolesByUserId:
        [
          { 
            id: mockGameRole1.id,
            role: mockGameRole1.role,
            game: {
              id: mockGame1.id,
              name: mockGame1.name
            }
          },
          {
            id: mockGameRole2.id,
            role: mockGameRole2.role,
            game: {
              id: mockGame2.id,
              name: mockGame2.name
            }
          } 
        ]
    }
  }
}

export const mockCreateGame: MockedResponse = {
  request: {
    query: CREATE_GAME,
    variables: {
      userId: mockKeycloakUser1.id,
      name: mockNewGameName,
      displayName: mockKeycloakUser1.username,
      email: mockKeycloakUser1.email
    }
  },
  result: {
    data: {
      createGame: {
        id: mockGame3.id,
        name: mockGame3.name,
        mc: mockGame3.mc,
        players: mockGame3.players,
        gameRoles: mockGame3.gameRoles
      }
    }
  }
}