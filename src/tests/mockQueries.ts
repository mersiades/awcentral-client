import { MockedResponse } from "@apollo/client/testing";
import { PlayBooks, Roles } from "../@types/enums";
import ADD_COMMS_APP from "../mutations/addCommsApp";
import ADD_COMMS_URL from "../mutations/addCommsUrl";
import ADD_INVITEE from "../mutations/addInvitee";
import ADD_USER_TO_GAME from "../mutations/addUserToGame";
import CREATE_CHARACTER from "../mutations/createCharacter";
import CREATE_GAME from "../mutations/createGame";
import SET_ANGEL_KIT from "../mutations/setAngelKit";
import SET_CHARACTER_GEAR from "../mutations/setCharacterGear";
import SET_CHARACTER_HX from "../mutations/setCharacterHx";
import SET_CHARACTER_LOOK from "../mutations/setCharacterLook";
import SET_CHARACTER_MOVES from "../mutations/setCharacterMoves";
import SET_CHARACTER_NAME from "../mutations/setCharacterName";
import SET_CHARACTER_PLAYBOOK from "../mutations/setCharacterPlaybook";
import SET_CHARACTER_STATS from "../mutations/setCharacterStats";
import GAME from "../queries/game";
import GAMEROLES_BY_USER_ID from "../queries/gameRolesByUserId";
import GAMES_FOR_INVITEE from "../queries/gamesForInvitee";
import PLAYBOOK_CREATOR from "../queries/playbookCreator";
import PLAYBOOKS from "../queries/playbooks";
import { dummyAngelKitMove, mockCharacter2,  mockGame1, mockGame2, mockGame3, mockGame4, mockGame5, mockGameRole1, mockGameRole2,  mockHxInput, mockKeycloakUser1, mockNewGameName, mockPlaybookCreatorAngel, mockPlaybooks } from "./mocks";

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
  result:  {
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
      }
    }
  }
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

export const mockCreateCharacter: MockedResponse = {
  request: {
    query: CREATE_CHARACTER,
    variables: { gameRoleId: mockGame5.gameRoles[2].id}
  },
  result:  {
    data: {
      createCharacter: {
        id: mockCharacter2.id
      }
    }
  }
}

export const mockSetCharacterPlaybook: MockedResponse = {
  request: {
    query: SET_CHARACTER_PLAYBOOK,
    variables: { gameRoleId: mockGame5.gameRoles[2].id, characterId: mockCharacter2.id, playbookType: PlayBooks.angel }
  },
  result:  {
    data: {
      setCharacterPlaybook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: "",
        gear: [],
        looks: []
      }
    }
  }
}

export const mockGameForCharacterCreation2: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: "",
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockPlaybookCreator: MockedResponse = {
  request: {
    query: PLAYBOOK_CREATOR,
    variables: { playbookType: PlayBooks.angel }
  },
  result: {
    data: {
      // playbookCreator:  mockPlaybookCreatorAngel
      playbookCreator: {
        id: mockPlaybookCreatorAngel.id,
        playbookType: mockPlaybookCreatorAngel.playbookType,
        gearInstructions: mockPlaybookCreatorAngel.gearInstructions,
        improvementInstructions: mockPlaybookCreatorAngel.improvementInstructions,
        movesInstructions: mockPlaybookCreatorAngel.movesInstructions,
        hxInstructions: mockPlaybookCreatorAngel.hxInstructions,
        looks: mockPlaybookCreatorAngel.looks,
        names: mockPlaybookCreatorAngel.names,
        statsOptions: mockPlaybookCreatorAngel.statsOptions,
        defaultMoveCount: mockPlaybookCreatorAngel.defaultMoveCount,
        moveChoiceCount: mockPlaybookCreatorAngel.moveChoiceCount,
        playbookMoves: mockPlaybookCreatorAngel.playbookMoves,
        // playbookUniqueCreator: mockPlaybookCreatorAngel.playbookUniqueCreator,
        playbookUniqueCreator: {
          id: mockPlaybookCreatorAngel.playbookUniqueCreator.id,
          type: mockPlaybookCreatorAngel.playbookUniqueCreator.type,
          angelKitCreator: mockPlaybookCreatorAngel.playbookUniqueCreator.angelKitCreator,
          customWeaponsCreator: {
            id: "dummy",
            firearmsTitle: "dummy",
            firearmsBaseInstructions: "dummy",
            firearmsBaseOptions: {
              id: "dummy",
              description: "dummy",
              tags: ["dummy"]
            },
            firearmsOptionsInstructions: "dummy",
            firearmsOptionsOptions: {
              id: "dummy",
              description: "dummy",
              tag: "dummy",
            },
            handTitle: "dummy",
            handBaseInstructions: "dummy",
            handBaseOptions: {
              id: "dummy",
              description: "dummy",
              tags: "dummy",
            },
            handOptionsInstructions: "dummy",
            handOptionsOptions: {
              id: "dummy",
              description: "dummy",
              tag: "dummy"
            }
          },
          brainerGearCreator: {
            id: "dummy",
            gear: ["dummy"]
          }
        },
      }
    }
  }
}

export const mockSetCharacterName: MockedResponse = {
  request: {
    query: SET_CHARACTER_NAME,
    variables: { gameRoleId: mockGame5.gameRoles[2].id, characterId: mockCharacter2.id, name: mockCharacter2.name }
  },
  result:  {
    data: {
      setCharacterName: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        gear: [],
        looks: []
      }
    }
  }
}

export const mockGameForCharacterCreation3: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterLook1: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[0].look,
      category: mockCharacter2.looks[0].category
    }
  },
  result:  {
    data: {
      setCharacterLook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        looks: [ mockCharacter2.looks[0]]
      }
    }
  }
}

export const mockGameForCharacterCreation4: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [mockCharacter2.looks[0]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterLook2: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[1].look,
      category: mockCharacter2.looks[1].category
    }
  },
  result:  {
    data: {
      setCharacterLook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        looks: [ mockCharacter2.looks[0], mockCharacter2.looks[1]]
      }
    }
  }
}

export const mockGameForCharacterCreation5: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterLook3: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[2].look,
      category: mockCharacter2.looks[2].category
    }
  },
  result:  {
    data: {
      setCharacterLook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        looks: [ mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2]]
      }
    }
  }
}

export const mockGameForCharacterCreation6: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterLook4: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[3].look,
      category: mockCharacter2.looks[3].category
    }
  },
  result:  {
    data: {
      setCharacterLook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        looks: [ mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3]]
      }
    }
  }
}

export const mockGameForCharacterCreation7: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterLook5: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[4].look,
      category: mockCharacter2.looks[4].category
    }
  },
  result:  {
    data: {
      setCharacterLook: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        looks: [ mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]]
      }
    }
  }
}

export const mockGameForCharacterCreation8: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: [],
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterStats: MockedResponse = {
  request: {
    query: SET_CHARACTER_STATS,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      statsOptionId: mockPlaybookCreatorAngel.statsOptions[0].id,
    }
  },
  result:  {
    data: {
      setCharacterStats: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        statsBlock: mockCharacter2.statsBlock
      }
    }
  }
}

export const mockGameForCharacterCreation9: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: [],
                statsBlock: mockCharacter2.statsBlock,
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterGear: MockedResponse = {
  request: {
    query: SET_CHARACTER_GEAR,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      gear: mockCharacter2.gear,
    }
  },
  result:  {
    data: {
      setCharacterGear: {
        id: mockCharacter2.id,
        playbook: mockCharacter2.playbook,
        name: mockCharacter2.name,
        gear: mockCharacter2.gear,
      }
    }
  }
}

export const mockGameForCharacterCreation10: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: mockCharacter2.gear,
                statsBlock: mockCharacter2.statsBlock,
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: [],
                playbookUnique: {
                  id: "dummy",
                  type: "dummy",
                  brainerGear: {
                    id: 'dummy',
                    brainerGear: []
                  },
                  customWeapons: {
                    id: "dummy",
                    weapons: []
                  },
                  angelKit: {
                    id: "dummy",
                    description: "dummy",
                    stock: 0,
                    hasSupplier: false,
                    supplierText: "dummy",
                    angelKitMoves: [dummyAngelKitMove]
                  }
                }
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetAngelKit: MockedResponse = {
  request: {
    query: SET_ANGEL_KIT,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      stock: mockPlaybookCreatorAngel.playbookUniqueCreator.angelKitCreator?.startingStock,
      hasSupplier: false
    }
  },
  result:  {
    data: {
      setAngelKit: {
        id: mockCharacter2.id,
        name: mockCharacter2.name,
        playbook: mockCharacter2.playbook,
        playbookUnique: mockCharacter2.playbookUnique
      }
    }
  }
}

export const mockGameForCharacterCreation11: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: mockCharacter2.gear,
                statsBlock: mockCharacter2.statsBlock,
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: [],
                playbookUnique: mockCharacter2.playbookUnique
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterMoves: MockedResponse = {
  request: {
    query: SET_CHARACTER_MOVES,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      moveIds: [mockPlaybookCreatorAngel.playbookMoves[1].id, mockPlaybookCreatorAngel.playbookMoves[2].id, mockPlaybookCreatorAngel.playbookMoves[0].id ]
    }
  },
  result:  {
    data: {
      setAngelKit: {
        id: mockCharacter2.id,
        name: mockCharacter2.name,
        playbook: mockCharacter2.playbook,
        characterMoves: mockCharacter2.characterMoves
      }
    }
  }
}

export const mockGameForCharacterCreation12: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: mockCharacter2.gear,
                statsBlock: mockCharacter2.statsBlock,
                hxBlock: [],
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: mockCharacter2.characterMoves,
                playbookUnique: mockCharacter2.playbookUnique
              }
            ]
           }
        ]
      }
    }
  }
}

export const mockSetCharacterHx: MockedResponse = {
  request: {
    query: SET_CHARACTER_HX,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      hxStats: [mockHxInput]
    }
  },
  result:  {
    data: {
      setAngelKit: {
        id: mockCharacter2.id,
        name: mockCharacter2.name,
        playbook: mockCharacter2.playbook,
        hxBlock: mockCharacter2.hxBlock
      }
    }
  }
}

export const mockGameForCharacterCreation13: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id }
  },
  result: {
    data: {
      game: {
        ...mockGame5,
        gameRoles: [
          mockGame5.gameRoles[0],
          mockGame5.gameRoles[1],
          { 
            id: mockGame5.gameRoles[2].id,
            role: mockGame5.gameRoles[2].role,
            userId: mockGame5.gameRoles[2].userId,
            npcs: mockGame5.gameRoles[2].npcs,
            threats: mockGame5.gameRoles[2].threats,
            characters: [
              {
                id: mockCharacter2.id,
                playbook: mockCharacter2.playbook,
                name: mockCharacter2.name,
                gear: mockCharacter2.gear,
                statsBlock: mockCharacter2.statsBlock,
                hxBlock: mockCharacter2.hxBlock,
                looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3], mockCharacter2.looks[4]],
                characterMoves: mockCharacter2.characterMoves,
                playbookUnique: mockCharacter2.playbookUnique
              }
            ]
           }
        ]
      }
    }
  }
}