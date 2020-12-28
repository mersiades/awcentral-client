import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GameData {
  game: Game
}

export interface GameVars {
  gameId: string
}

const GAME = gql`
  query Game($gameId: String!) {
    game(gameId: $gameId) {
      id
      name
      invitees
      commsApp
      commsUrl
      mc {
        displayName
      }
      players {
        displayName
      }
      gameRoles {
        id
        role
        userId
        npcs {
          id
        }
        threats {
          id
        }
        characters {
          id
          name
          playbook
          gear
          statsBlock {
            id
            stats {
              id
              stat
              value
              isHighlighted
            }
          }
          hxBlock {
            id
            characterId
            characterName
            hxValue
          }
          looks {
            look
            category
          }
          characterMoves {
            id
            isSelected
            name
            kind
            description
            playbook
            stat
            rollModifier {
              id
              movesToModify {
                id
              }
              statToRollWith
            }
          }
          playbookUnique {
            id
            type
            brainerGear {
              id
              brainerGear
            }
            angelKit {
              id
              description
              stock
              angelKitMoves {
                id
              }
              hasSupplier
              supplierText
            }
            customWeapons {
              id
              weapons
            }
          }
        }
      }
  }
}
`;
export default GAME;