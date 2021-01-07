import { MockedResponse } from "@apollo/client/testing";
import { Roles } from "../@types/enums";
import ADD_COMMS_APP from "../mutations/addCommsApp";
import ADD_COMMS_URL from "../mutations/addCommsUrl";
import ADD_INVITEE from "../mutations/addInvitee";
import ADD_USER_TO_GAME from "../mutations/addUserToGame";
import CREATE_GAME from "../mutations/createGame";
import GAME from "../queries/game";
import GAMEROLES_BY_USER_ID from "../queries/gameRolesByUserId";
import GAMES_FOR_INVITEE, { GamesForInviteeData, GamesForInviteeVars } from "../queries/gamesForInvitee";
import PLAYBOOKS from "../queries/playbooks";
import { mockCharacter1, mockCharacterMoveAngel3, mockGame1, mockGame2, mockGame3, mockGame4, mockGame5, mockGameRole1, mockGameRole2, mockGameRole4, mockKeycloakUser1, mockNewGameName, mockPlaybooks } from "./mocks";

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

export const mockGamesForInvitee: MockedResponse = {
  request: {
    query: GAMES_FOR_INVITEE,
    variables: { email: mockKeycloakUser1.email }
  },
  result:  {
    data: {
      gamesForInvitee: [{
        id: mockGame4.id,
        name: mockGame4.name,
        mc: mockGame4.mc,
        players: mockGame4.players,
      }]
    }
  }
}

export const mockAddUserToGame: MockedResponse = {
  request: {
    query: ADD_USER_TO_GAME,
    variables: { 
      userId: mockKeycloakUser1.id,
      displayName: mockKeycloakUser1.username,
      email: mockKeycloakUser1.email,
      gameId: mockGame4.id }
  },
  result:  {
    data: {
      addUserToGame: [{
        id: mockGame4.id,
        name: mockGame4.name,
        mc: {
          displayName: mockGame4.mc.displayName
        },
        players: [
          { displayName: mockGame4.players[0].displayName}
        ],
        gameRoles: [...mockGame4.gameRoles, {
          id: "mock-gamerole-id-8",
          role: Roles.player,
          userId: 'mock-keycloak-id-1'
        }]
      }]
    }
  }
}

export const mockGameForCharacterCreation1: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: () =>  {
    console.log('mockGameForCharacterCreation1')
    return {
    data: {
      game: {
        id: mockGame5.id,
        name: mockGame5.name,
        invitees: [],
        commsApp: mockGame5.commsApp,
        commsUrl: mockGame5.commsUrl,
        mc: mockGame5.mc,
        players: mockGame5.players,
        gameRoles: mockGame5.gameRoles
        // mc: {
        //   id: mockGame5.mc.id,
        //   displayName: mockGame5.mc.displayName
        // },
        // players: [{ id: 'mock-keycloak-id-3', displayName: 'mock-user-3'}, { id: 'mock-keycloak-id-1', displayName: 'mock-user-1'} ],
        // gameRoles: [
        //   {
        //     id: "mock-gamerole-id-6",
        //     role: Roles.mc,
        //     userId: 'mock-keycloak-id-2',
        //   },
        //   {
        //     id: "mock-gamerole-id-7",
        //     role: Roles.player,
        //     userId: 'mock-keycloak-id-3',
        //     characters: [
        //       {
        //         id: mockCharacter1.id,
        //         name: mockCharacter1.name,
        //         playbook: mockCharacter1.playbook,
        //         gear: mockCharacter1.gear,
        //         statsBlock: mockCharacter1.statsBlock,
        //         hxBlock: mockCharacter1.hxBlock,
        //         looks: mockCharacter1.looks,
        //         characterMoves: mockCharacter1.characterMoves,
        //         playbookUnique: mockCharacter1.playbookUnique
        //       }
        //     ]
        //   },
        //   {
        //     id: "mock-gamerole-id-8",
        //     role: Roles.player,
        //     userId: 'mock-keycloak-id-1',
        //     characters: []
        //   },
        // ]
        // [
        //   { 
        //     id: mockGame3.gameRoles[0].id,
        //     role: mockGame3.gameRoles[0].role,
        //     userId: mockGame3.gameRoles[0].userId,
        //     npcs: [],
        //     threats: [],
        //     characters: []
        //   }
        // ]
      }
    }
  }}
}

export const mockPlaybooksQuery: MockedResponse = {
  request: {
    query: PLAYBOOKS,
  },
  result:  {
    data: {
      playbooks: mockPlaybooks
    }
  }
}