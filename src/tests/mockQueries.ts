import { MockedResponse } from "@apollo/client/testing";
import { Roles } from "../@types/enums";
import ADD_COMMS_APP from "../mutations/addCommsApp";
import ADD_COMMS_URL from "../mutations/addCommsUrl";
import ADD_INVITEE from "../mutations/addInvitee";
import CREATE_GAME from "../mutations/createGame";
import GAME from "../queries/game";
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

export const mockGameForNewGame: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: mockGame3.commsApp,
        commsUrl: mockGame3.commsUrl,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    
  }}
}

export const mockAddCommsApp: MockedResponse = {
  request: {
    query: ADD_COMMS_APP,
    variables: { gameId: mockGame3.id, app: "Discord" }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: "Discord",
        commsUrl: mockGame3.commsUrl,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        
      }
    
  }}
}

export const mockGameAfterAddCommsApp: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id }
  },
  result:  {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: "Discord",
        commsUrl: mockGame3.commsUrl,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      
    }
  }}
}

export const mockAddCommsUrl: MockedResponse = {
  request: {
    query: ADD_COMMS_URL,
    variables: { gameId: mockGame3.id, url: "https://discord.com/urltodiscordchannel" }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
      }
    
  }}
}

export const mockGameAfterAddCommsUrl: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id }
  },
  result:{
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    }
  }
}

export const mockAddInvitee1: MockedResponse = {
  request: {
    query: ADD_INVITEE,
    variables: { gameId: mockGame3.id, email: 'mockUser2@email.com' }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com'],
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    }
  }
}

export const mockGameAfterAddInvitee1: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com'],
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    }
  }
}

export const mockAddInvitee2: MockedResponse = {
  request: {
    query: ADD_INVITEE,
    variables: { gameId: mockGame3.id, email: 'mockUser3@email.com' }
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com', 'mockUser3@email.com'],
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    }
  }
}

export const mockGameAfterAddInvitee2: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id }
  },
  result:  {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com', 'mockUser3@email.com'],
        commsApp: "Discord",
        commsUrl: "https://discord.com/urltodiscordchannel",
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName
        },
        players: [],
        gameRoles: [
          { 
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: []
          }
        ]
      }
    }
  }
}